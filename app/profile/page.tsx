"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User, ArrowLeft, Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cropper from "react-easy-crop";
import LoadingScreen from "@/components/LoadingScreen";

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  plan: string;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Cropper state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Form state
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setAuthUser(user);

    if (user) {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl || null,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        // Update local state to match saved values
        setUsername(updatedProfile.username || '');
        setBio(updatedProfile.bio || '');
        setAvatarUrl(updatedProfile.avatar_url || '');
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to desired output size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !authUser) return;

    setUploading(true);

    try {
      // Get cropped image blob
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([oldPath]);
        }
      }

      // Upload new avatar
      const fileName = `${Date.now()}.jpg`;
      const filePath = `${authUser.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      setAvatarUrl(publicUrl);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim() || null,
          bio: bio.trim() || null,
          avatar_url: publicUrl,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
      }

      // Reset modal state
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelCrop = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-medium text-foreground tracking-tight">
                Profile Settings
              </h1>
              <p className="text-xs font-mono tracking-wider text-muted-foreground mt-1 uppercase">
                Manage Your Account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-card border border-border shadow-sm">
          {/* Avatar Section */}
          <div className="p-8 border-b border-border">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={avatarUrl || authUser?.user_metadata?.avatar_url} alt={username || 'User'} />
                  <AvatarFallback className="bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-8 w-8 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-serif font-medium text-foreground mb-1">
                  Profile Picture
                </h2>
                <p className="text-sm text-muted-foreground font-light mb-3">
                  Click on your avatar to upload a new profile picture
                </p>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Plan: {profile?.plan || 'Free'}
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
                className="rounded-sm border-border bg-card font-mono"
              />
              <p className="text-xs text-muted-foreground font-light">
                Your unique username for Human Operations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="rounded-sm border-border bg-card resize-none"
              />
              <p className="text-xs text-muted-foreground font-light">
                A brief description about yourself
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="space-y-2 mb-6">
                <Label className="text-xs font-mono tracking-wider uppercase text-foreground">
                  Account Email
                </Label>
                <div className="text-sm font-mono text-muted-foreground bg-muted px-4 py-3 border border-border rounded-sm">
                  {authUser?.email}
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Email cannot be changed
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-mono text-xs tracking-wide uppercase rounded-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={(open) => {
        setIsUploadModalOpen(open);
        if (!open) {
          handleCancelCrop();
        }
      }}>
        <DialogContent className="sm:max-w-[600px] rounded-sm bg-card border-border p-0">
          <DialogTitle className="sr-only">
            {!imageSrc ? 'Upload Profile Picture' : 'Crop Profile Picture'}
          </DialogTitle>
          {!imageSrc ? (
            // File selection screen
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-medium text-foreground mb-2">
                  Upload Profile Picture
                </h2>
                <p className="text-sm text-muted-foreground font-light">
                  Select an image to crop and upload
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-sm p-12 text-center cursor-pointer hover:border-foreground/20 hover:bg-muted transition-colors"
              >
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-mono text-foreground uppercase tracking-wide mb-2">
                  Click to Select Image
                </p>
                <p className="text-xs text-muted-foreground font-light">
                  Max 2MB • JPG, PNG, GIF
                </p>
              </div>
            </div>
          ) : (
            // Cropping screen
            <div>
              <div className="relative bg-gray-900 dark:bg-black" style={{ height: '400px' }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="p-6 space-y-4 bg-card border-t border-border">
                <div className="space-y-2">
                  <Label className="text-xs font-mono tracking-wider uppercase text-foreground">
                    Zoom
                  </Label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCancelCrop}
                    variant="outline"
                    className="flex-1 rounded-sm border-border font-mono text-xs tracking-wide uppercase"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadCroppedImage}
                    className="flex-1 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-mono text-xs tracking-wide uppercase rounded-sm"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

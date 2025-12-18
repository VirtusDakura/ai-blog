"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);

     
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
            onChange(result.info.secure_url);
        }
    };

    if (!isMounted) {
        return null;
    }

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
        console.warn('Cloudinary upload preset not configured');
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Uploaded image"
                            src={url}
                            sizes="200px"
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={onSuccess}
                uploadPreset={uploadPreset || "ml_default"}
                options={{
                    maxFileSize: 5000000, // 5MB
                    resourceType: "image",
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
                    sources: ["local", "url", "camera"],
                    multiple: false,
                    cropping: true,
                    croppingAspectRatio: 16 / 9,
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;

"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaCircle } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

interface IMediaCarousel {
    mediaURLs: MediaURL[];
    className?: string;
    width?: number;
    height?: number;
}

function MediaCarousel({
    mediaURLs,
    className,
    width,
    height,
}: IMediaCarousel) {
    const [mediaIndex, setMediaIndex] = useState(0);
    const currentMedia = mediaURLs[mediaIndex];
    return (
        <figure className={className}>
            <div className="overflow-hidden flex items-center justify-center">
                {!!currentMedia && currentMedia.type === "image" && (
                    <Image
                        src={currentMedia.url}
                        alt="title"
                        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                        width={width ?? 0}
                        height={height ?? 0}
                        {...(!width &&
                            !height && {
                                style: { width: "100%", height: "auto" },
                            })}
                    />
                )}
            </div>
            <div className="absolute mx-auto flex left-0 right-0 justify-center gap-1 bottom-2">
                {[...Array(mediaURLs.length)].map((_, i) => (
                    <button
                        key={uuidv4() + "-" + mediaURLs[i].url + i}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMediaIndex(i);
                        }}
                        className="text-indigo-500 hover:text-(--color-s-2)"
                    >
                        <FaCircle />
                    </button>
                ))}
            </div>
        </figure>
    );
}

export default MediaCarousel;

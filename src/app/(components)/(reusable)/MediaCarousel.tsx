"use client"
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
            <div className="overflow-hidden flex items-center">
                {!!currentMedia && currentMedia.type === "image" && (
                    <Image
                        src={currentMedia.url}
                        alt="title"
                        width={width ?? 250}
                        height={height ?? 250}
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
                        className="text-indigo-500 hover:text-[color:--color-s-2]"
                    >
                        <FaCircle />
                    </button>
                ))}
            </div>
        </figure>
    );
}

export default MediaCarousel;

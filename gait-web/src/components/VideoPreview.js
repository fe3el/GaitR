'use client';
import { useState } from 'react';
import styles from './VideoPreview.module.css';
import React from 'react';

export default function VideoPreview({ videoFile }) {
    const isTooSmall = videoFile && videoFile.size < 1 * 1;

    return (
        <div className={styles.previewContainer}>
            {videoFile ? (
                isTooSmall ? (
                    <div className={styles.placeholder}>⚠️ This video is too small to preview</div>
                ) : (
                    <video
                        className={styles.video}
                        width="100%"
                        height="100%"
                        controls
                        src={URL.createObjectURL(videoFile)}
                    />
                )
            ) : (
                <div className={styles.placeholder}>No Video Selected</div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useRef } from "react";
import type { ConversationMessage } from "@/types/workspace";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import styles from "./DiscoveryWorkspace.module.css";

export function ConversationTimeline({
  messages,
  isTyping,
}: {
  messages: ConversationMessage[];
  isTyping: boolean;
}) {
  const timelineEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    timelineEnd.current?.scrollIntoView?.({
      block: "end",
      behavior: "smooth",
    });
  }, [isTyping, messages.length]);

  return (
    <div
      className={styles.timeline}
      aria-label="Discovery conversation"
      aria-live="polite"
    >
      <p className={styles.timelineDate}>Current discovery session</p>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping ? <TypingIndicator /> : null}
      <div ref={timelineEnd} />
    </div>
  );
}

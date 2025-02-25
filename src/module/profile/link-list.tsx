"use client"

import { DraggableCardList } from "@/module/profile/components/draggable-list"

export default function LinkList() {
  return (
    <DraggableCardList
      initialItems={[
        {
          id: "1",
          title: "Personal Information",
          content: "Name, email, and contact details",
        },
        {
          id: "2",
          title: "Work Experience",
          content: "Your work history and professional experience",
        },
        {
          id: "3",
          title: "Education",
          content: "Academic background and qualifications",
        },
        {
          id: "4",
          title: "Skills",
          content: "Technical and soft skills you possess",
        },
        {
          id: "5",
          title: "Projects",
          content: "Notable projects you've worked on",
        },
      ]}
      onOrderChange={(newItems) => {
        console.log("New order:", newItems)
        // Here you would typically save the new order to your backend
      }}
    />
  )
}

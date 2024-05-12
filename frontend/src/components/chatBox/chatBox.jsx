import React from 'react'
import { ChatState } from '../../context/userContext';

export default function chatBox() {
    const {user}=ChatState();
  return (
    <div>
      {user}
    </div>
  )
}

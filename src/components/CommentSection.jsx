import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';

const CommentSection = ({articleId}) => {
    const { user, profile } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const commentInputRef = useRef(null);


    // console.log("user info", user)




  return (
    <div className=''>
      
    </div>
  )
}

export default CommentSection
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new';

// import the package CSS directly so Vite can resolve it reliably
import 'react-quill-new/dist/quill.snow.css'
import './quill.snow.css'

// use forwardRef to properly handle the ref

const QuillEditor = forwardRef(({value, onChange, placeholder, className, height = 400}, ref) => {

   // create a separate ref for the reactQuill component
    const quillRef = useRef(null);

    const [editorValue, setEditorValue] = useState(value || '');

    // Update local state when prop value change
    useEffect(()=>{
        setEditorValue(value || "")
    },[value])

    // Create a memoized onChange handler
    const handleChange = useCallback((value) => { 

        setEditorValue(value)
        onChange(value)

    },[onChange]);

    // setup module
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    };
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent', 'link', 'image', 'code-block', 'script'
    ];    

    return (
    <div className={className || ""} style={{height: `${height}px` }}>
            <ReactQuill
                ref={quillRef}
                value={editorValue}
                onChange={handleChange}
                placeholder={placeholder || "Write Your content....."}
                theme='snow'
                style={{height: `${height - 42}px`}}
                modules={modules}
                formats={formats}
            
            />
    </div>
  )
})

export default QuillEditor
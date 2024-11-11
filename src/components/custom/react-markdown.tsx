'use client';
import React from 'react'
import ReactMarkdown from 'react-markdown'
// import ReactDom from 'react-dom'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
// const markdown = `#Hello ! How can I assist you today ?`
// const htmlText = `<div class="note">

// Some *emphasis* and <strong>strong</strong>!

// </div>`
export const ReactMarkdownChat = ({children}: {children: string}) => {
    return (
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[[remarkGfm, { singleTilde: false }],]}>
            {children}
        </ReactMarkdown>
    )
}

export default ReactMarkdownChat
'use client';
import React from 'react'

export const ReactMarkdownChat = ({ children }: { children: string }) => {
    // Remove ```html\n from the start and ``` from the end
    const htmlCode = children?.replace(/^```html\n/, '').replace(/\n```$/, '');
    return (
        // <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[[remarkGfm, { singleTilde: false }],]}>
        //     {htmlCode}
        // </ReactMarkdown>
        <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
    )
}

export default ReactMarkdownChat
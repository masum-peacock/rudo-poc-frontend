"use client";
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

const ReportPage = () => {
    const [reportHTML, setReportHTML] = useState<string>('');

    useEffect(() => {
        // Sample Markdown content (You can replace this with your dynamic content from the API)
        const markdownData = `
    # Blood Group & Rh Factor Test Report Summary

    ## Patient Information
    - **Name:** Mr. Ket an Chavan
    - **Sex:** Male
    - **Age:** 29 Years
    - **Date of Sample Collection:** 12-Aug-2011
    - **Referred By:** Dr. Patil M.B.B.S.
    - **Lab No.:** 5
    - **Lab Name:** Crystal Lab

    ## Test Results
    - **Blood Group:** A
    - **Rh Factor:** Negative

    ## Method Used
    - **Method:** Slide Agglutination

    ## Report Details
    - **Report Printed By:** My Lab (www.crystaldatainc.com)
    - **Technician:** Chandan Vartak, D.M.L.T.
    - **Reviewer:** Dr. Pankaj Shah, M.D., M.B.B.S.
    `;

        // Convert Markdown to HTML using remark
        remark()
            .use(html)
            .process(markdownData, (err, file) => {
                if (err) {
                    console.error(err);
                    return;
                }
                setReportHTML(file?.toString() || '');
            });
    }, []);

    return (
        <div>
            <h1>Test Report</h1>
            {/* Render the HTML content */}
            <div
                className="report-content"
                dangerouslySetInnerHTML={{ __html: reportHTML }}
            />
        </div>
    );
};

export default ReportPage;

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import getTerms from '../utils/termsAndConditions';


/**
 * A React component to display the content of a Markdown file fetched from an API.
 *
 * @param {Object} props - The component's properties.
 * @param {string} props.path - The path to the Markdown file to fetch.
 * @returns {JSX.Element} The rendered component.
 */
function TermsAndPoliciesMarkdown() {
    const [content, setContent] = useState('');

    useEffect(() => {
        getTerms().then((fileContent) =>{
        if (fileContent !== null) {
            setContent(fileContent);
        } else {
            setContent("Lo siento, el contenido no pudo ser cargado.");
        }
    }).catch((err) => {
        setContent("Lo siento, el contenido no pudo ser cargado.");
    });
    }, []);

    return (
        <div>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}

export default TermsAndPoliciesMarkdown;

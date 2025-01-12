import React from "react";
import "./highlight.css";
import './darkmode.css'
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

function Highlight({ highlightedText, setHighlightedText }) {
    const [keyword, setKeyword] = React.useState("");

    const addKeyword = (key) => {
        setHighlightedText((prev) => {
            if (prev.some(item => item.value.toLowerCase() === key.toLowerCase())) return prev;
            return [...prev, { value: key, id: Math.random() * 1001 }];
        });
    };

    const removeKeyword = (id) => {
        setHighlightedText((prev) => prev.filter((item) => item.id !== id));
    };

    const handleKeywords = (e) => {
        setKeyword(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && keyword.trim() !== "") {
            addKeyword(keyword.trim());
            setKeyword("");
        }
    };


    return (
        <div className="text-area">
            <div className="info-container">
                <InfoIcon fontSize="small" className="info" />
                <span className="tips">Enter keywords and press Enter</span>
            </div>
            <div className="keywords-container">
                {highlightedText.map((item) => (
                    <div key={item.id} className="key-item">
                        {item.value}
                        <CloseIcon
                            className="remove"
                            fontSize="small"
                            onClick={() => removeKeyword(item.id)}
                        />
                    </div>
                ))}
            </div>
            <input
                name="keyword"
                className="keyword"
                value={keyword}
                onChange={handleKeywords}
                onKeyDown={handleKeyDown}
                placeholder="Add a keyword..."
            />
        </div>
    );
}

export default Highlight;

import React from "react";
import "./speacharea.css";
import './darkmode.css'
import preloader from "/preloader.gif";
import "regenerator-runtime/runtime";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import Highlight from "./Highlight.jsx";

function SpeachArea() {
    const [language, setLanguage] = React.useState("en-IN");
    const [highlight, setHighlight] = React.useState(false);
    const [highlightedText, setHighlightedText] = React.useState([]);
    const [preload, isPreloader] = React.useState(false);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [copied,iscopy] = React.useState(false);
    const [isspeaking,setspeak] = React.useState(false);

    // Change language with loader
    const changeLanguage = (e) => {
        isPreloader(true);
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        SpeechRecognition.stopListening();
        setTimeout(() => {
            SpeechRecognition.startListening({ continuous: true, language: selectedLanguage });
            isPreloader(false);
        }, 700);
    };

    // Command recognition: reset or stop
    React.useEffect(() => {
        const normalizedTranscript = transcript.replace(/[\s,\.!?]+/g, "").toLowerCase();
        if (/rjreset/.test(normalizedTranscript)) resetTranscript();
        if (/rjstop/.test(normalizedTranscript)) SpeechRecognition.stopListening();
    }, [transcript]);

    // Fallback for unsupported browsers
    if (!browserSupportsSpeechRecognition) {
        return <div>Sorry, your browser does not support speech recognition.</div>;
    }

    // Start listening
    const handleStartListening = () => {
        SpeechRecognition.startListening({ continuous: true, language });
    };

    // Scroll to the latest transcript
    const textRef = React.useRef(null);
    React.useEffect(() => {
        if (textRef.current) {
            textRef.current.scrollTop = textRef.current.scrollHeight;
        }
    }, [transcript]);

    // Highlight transcript text
    const getHighlightedTranscript = () => {
        if (!highlightedText.length) return transcript;

        const regex = new RegExp(`(${highlightedText.map(item => item.value).join('|')})`, 'gi');
        return transcript.split(regex).map((word, index) => {
            if (highlightedText.some(item => item.value.toLowerCase() === word.toLowerCase())) {
                return (
                    <span key={index} className="highlight" onClick={() => handleRemoveHighlight(word)}>
                        {word}
                    </span>
                );
            }
            return word;
        });
    };

    // Remove highlighted word
    const handleRemoveHighlight = (word) => {
        setHighlightedText(prev => prev.filter(item => item.value !== word));
    };

    // Speak out transcript
    const handleSpeak = () => {
        if (!transcript) {
            alert("No transcript available to speak!");
            return;
        }
    
        if (!isspeaking) {
            // Start speaking
            const utterance = new SpeechSynthesisUtterance(transcript);
            utterance.lang = language;
            utterance.onend = () => setspeak(false); // Reset state when speaking finishes
            window.speechSynthesis.speak(utterance);
            setspeak(true);
        } else {
            // Stop speaking
            window.speechSynthesis.cancel();
            setspeak(false);
        }
    };
    

    //handle darkmode
    const handleDarkMode = () => {
        document.body.classList.toggle("darkmod");
        setIsDarkMode(!isDarkMode);
    }

    //copy to clipboard
    const copytoClickboard = () => {
        if(transcript){
            navigator.clipboard.writeText(transcript).then(()=>{
                iscopy(true);
                setInterval(() => {
                    iscopy(false);
                }, 3000);
            }).catch((e)=>{
                console.log(e);
            })
        }
    }

    return (
        <div className="box">
            {preload && <img className="preloader" src={preloader} alt="preloader" />}
            
            <div className="extra-feature">
            {!isDarkMode ? <DarkModeIcon onClick={handleDarkMode}/> : <LightModeIcon onClick={handleDarkMode}/>}
                <span className={copied ? "copy" : "notcopy"}>Text is copied</span>
                <ContentCopyIcon className="clipboard" onClick={copytoClickboard} />
                <LoyaltyIcon className="tag" onClick={() => setHighlight(!highlight)} />
            </div>
            
            {highlight && (
                <Highlight
                    highlightedText={highlightedText} 
                    setHighlightedText={setHighlightedText} 
                />
            )}
            
            <div className="text-box" ref={textRef}>
                <p className={`text ${listening ? "listening" : ""}`}>
                    {getHighlightedTranscript()}
                </p>
            </div>

            <div className="control">
                <div className="lis-control">
                    <button className="btn" onClick={resetTranscript}>Reset</button>
                    <button className="btn" onClick={handleStartListening}>Start</button>
                    
                    <button className="btn" onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className="btn" onClick={handleSpeak}>Speak</button>
                </div>
                <div>
                    <select
                        name="languages"
                        id="language-select"
                        value={language}
                        onChange={changeLanguage}
                        className="btn"
                    >
                        <option value="en-IN">English</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="zh-CN">Chinese</option>
                        <option value="ar-SA">Arabic</option>
                        <option value="ja-JP">Japanese</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SpeachArea;

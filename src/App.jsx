import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import { FaRobot } from 'react-icons/fa'


function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(``)
  const [loading, setLoading] = useState(false)
  const [review, setReview] = useState(``)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setLoading(true)
    try {
      const response = await axios.post('https://code-reviwer-api.onrender.com/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error("Error reviewing code:", error)
      setReview("Error fetching review.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <div className="editor-wrapper">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  height: "100%",
                  width: "100%"
                }}
              />
            </div>
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          {loading ? (
            <div className="loader">
              <FaRobot className="spinner" size={40} />
              <p>Reviewing your code...</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          )}
        </div>
      </main>
    </>
  )
}



export default App
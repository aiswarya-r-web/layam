import { useEffect, useState } from 'react'

export default function useTypewriter(phrases, speed = 80, pause = 1500) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[index % phrases.length]
    let delay = deleting ? speed / 2 : speed
    if (!deleting && text === phrase) delay = pause

    const t = setTimeout(() => {
      if (!deleting && text === phrase) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % phrases.length)
      } else {
        setText(phrase.slice(0, text.length + (deleting ? -1 : 1)))
      }
    }, delay)

    return () => clearTimeout(t)
  }, [text, deleting, index, phrases, speed, pause])

  return text
}

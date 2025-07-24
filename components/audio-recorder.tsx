"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Play, Pause, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

interface AudioRecorderProps {
  onTranscription: (text: string) => void
  placeholder?: string
}

export default function AudioRecorder({
  onTranscription,
  placeholder = "Record your story idea...",
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.success("Recording started...")
    } catch (error) {
      console.error("Error starting recording:", error)
      toast.error("Failed to start recording. Please check microphone permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast.success("Recording stopped!")
    }
  }

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setIsPlaying(false)
  }

  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error("No audio to transcribe")
      return
    }

    setIsTranscribing(true)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to transcribe audio")
      }

      const { transcription } = await response.json()
      onTranscription(transcription)
      toast.success("Audio transcribed successfully!")
      clearRecording()
    } catch (error) {
      console.error("Error transcribing audio:", error)
      toast.error("Failed to transcribe audio")
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-purple-200">
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">{placeholder}</p>

          <div className="flex items-center justify-center gap-3 mb-4">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white" size="lg">
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white animate-pulse"
                size="lg"
              >
                <MicOff className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>

          {audioUrl && (
            <div className="space-y-3">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />

              <div className="flex items-center justify-center gap-2">
                {!isPlaying ? (
                  <Button onClick={playAudio} variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                ) : (
                  <Button onClick={pauseAudio} variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                )}

                <Button onClick={clearRecording} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>

              <Button
                onClick={transcribeAudio}
                disabled={isTranscribing}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isTranscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Transcribe to Text
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ArrowRightLeft, Copy, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CaesarCipher() {
  const [input, setInput] = useState("")
  const [shift, setShift] = useState([3])
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState("encrypt")

  const handleProcess = () => {
    if (!input) return

    const shiftValue = mode === "encrypt" ? shift[0] : (26 - shift[0]) % 26
    const result = caesarCipher(input, shiftValue)
    setOutput(result)
  }

  const caesarCipher = (text: string, shift: number): string => {
    return text
      .split("")
      .map((char) => {
        // Handle uppercase letters
        if (char.match(/[A-Z]/)) {
          const code = char.charCodeAt(0)
          return String.fromCharCode(((code - 65 + shift) % 26) + 65)
        }
        // Handle lowercase letters
        else if (char.match(/[a-z]/)) {
          const code = char.charCodeAt(0)
          return String.fromCharCode(((code - 97 + shift) % 26) + 97)
        }
        // Leave non-alphabetic characters unchanged
        return char
      })
      .join("")
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
    }
  }

  const handleModeChange = (value: string) => {
    setMode(value)
    if (input && output) {
      // Swap input and output when changing modes
      setInput(output)
      setOutput("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Caesar Cipher</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    The Caesar Cipher is a substitution cipher where each letter is shifted a fixed number of places in
                    the alphabet.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Encrypt or decrypt text by shifting letters in the alphabet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
              <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="input">{mode === "encrypt" ? "Plain Text" : "Cipher Text"}</Label>
            <Input
              id="input"
              placeholder={mode === "encrypt" ? "Enter text to encrypt" : "Enter text to decrypt"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="shift">Shift Value: {shift[0]}</Label>
            </div>
            <Slider id="shift" min={1} max={25} step={1} value={shift} onValueChange={setShift} />
          </div>

          <Button onClick={handleProcess} className="w-full">
            {mode === "encrypt" ? "Encrypt" : "Decrypt"}
          </Button>

          {output && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="output">{mode === "encrypt" ? "Cipher Text" : "Plain Text"}</Label>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-md font-mono break-all">{output}</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (input && output) {
                setInput(output)
                setOutput("")
                setMode(mode === "encrypt" ? "decrypt" : "encrypt")
              }
            }}
            disabled={!output}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Swap Input/Output
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


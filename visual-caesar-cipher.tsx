"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ArrowRightLeft, Copy, Info, Play, RotateCcw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

export default function VisualCaesarCipher() {
  const [input, setInput] = useState("HELLO")
  const [shift, setShift] = useState([3])
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState("encrypt")
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [characterMappings, setCharacterMappings] = useState<{ original: string; transformed: string }[]>([])

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const shiftedAlphabet = getShiftedAlphabet(shift[0], mode === "encrypt")

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showAnimation])

  function getShiftedAlphabet(shiftValue: number, encrypt: boolean) {
    const actualShift = encrypt ? shiftValue : (26 - shiftValue) % 26
    return alphabet.slice(actualShift) + alphabet.slice(0, actualShift)
  }

  const handleProcess = () => {
    if (!input) return

    setShowAnimation(true)
    setAnimationComplete(false)

    const shiftValue = mode === "encrypt" ? shift[0] : (26 - shift[0]) % 26
    const result = caesarCipher(input, shiftValue)

    // Create character mappings for visualization
    const mappings = input.split("").map((char, index) => ({
      original: char,
      transformed: result[index] || char,
    }))

    setCharacterMappings(mappings)
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
    setShowAnimation(false)
    setAnimationComplete(false)
    if (input && output) {
      // Swap input and output when changing modes
      setInput(output)
      setOutput("")
    }
  }

  const resetAnimation = () => {
    setShowAnimation(false)
    setAnimationComplete(false)
  }

  const getCharColor = (char: string) => {
    if (!char.match(/[A-Za-z]/)) return "text-gray-500"

    // Different colors for different parts of the alphabet
    const index = char.toUpperCase().charCodeAt(0) - 65
    if (index < 9) return "text-blue-500"
    if (index < 18) return "text-purple-500"
    return "text-red-500"
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Visual Caesar Cipher</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    The Caesar Cipher shifts each letter in the alphabet by a fixed number of positions. This visual
                    tool shows you exactly how each letter transforms.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Visualize encryption and decryption with the classic Caesar shift cipher</CardDescription>
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
              onChange={(e) => {
                setInput(e.target.value.toUpperCase())
                resetAnimation()
              }}
              className="text-lg font-mono"
            />
          </div>

          {/* Alphabet Visualization */}
          <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <Label className="text-sm font-medium">Alphabet Shift Visualization</Label>
            <div className="flex flex-col space-y-2 font-mono text-center">
              <div className="flex justify-between overflow-x-auto py-2">
                {alphabet.split("").map((letter, i) => (
                  <div key={`original-${i}`} className="w-8 h-8 flex items-center justify-center">
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: mode === "encrypt" ? 360 : -360 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <ArrowRightLeft className="text-primary" />
                </motion.div>
              </div>
              <div className="flex justify-between overflow-x-auto py-2">
                {shiftedAlphabet.split("").map((letter, i) => (
                  <div
                    key={`shifted-${i}`}
                    className={`w-8 h-8 flex items-center justify-center ${getCharColor(letter)}`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="shift">Shift Value: {shift[0]}</Label>
              <span className="text-sm text-muted-foreground">
                {mode === "encrypt" ? "A → " + shiftedAlphabet[0] : shiftedAlphabet[0] + " → A"}
              </span>
            </div>
            <Slider
              id="shift"
              min={1}
              max={25}
              step={1}
              value={shift}
              onValueChange={(value) => {
                setShift(value)
                resetAnimation()
              }}
              className="py-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleProcess} className="w-full" size="lg">
              <Play className="mr-2 h-4 w-4" />
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (input && output) {
                  setInput(output)
                  setOutput("")
                  setMode(mode === "encrypt" ? "decrypt" : "encrypt")
                  resetAnimation()
                }
              }}
              disabled={!output}
              size="lg"
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Swap
            </Button>
          </div>

          {/* Character Transformation Visualization */}
          {showAnimation && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Label className="text-sm font-medium">Character Transformation</Label>
              <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                {characterMappings.map((mapping, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: animationComplete ? 40 : 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`w-10 h-10 flex items-center justify-center text-xl font-bold ${getCharColor(mapping.original)}`}
                    >
                      {mapping.original}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -40 }}
                      animate={{
                        opacity: animationComplete ? 1 : 0,
                        y: animationComplete ? 0 : -40,
                      }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className={`w-10 h-10 flex items-center justify-center text-xl font-bold ${getCharColor(mapping.transformed)}`}
                    >
                      {mapping.transformed}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {output && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="output">{mode === "encrypt" ? "Cipher Text" : "Plain Text"}</Label>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-lg break-all">
                {output.split("").map((char, index) => (
                  <span key={index} className={getCharColor(char)}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={resetAnimation} disabled={!showAnimation}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Animation
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


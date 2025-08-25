"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/userActions";
import { getFiles } from "@/lib/actions/fileActions";
import Image from "next/image";

const Chatbot = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [apiStatus, setApiStatus] = useState("unknown"); // 'connected', 'disconnected', 'unknown'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUserData();
    checkApiStatus(); // Initial check

    const interval = setInterval(() => {
      checkApiStatus();
    }, 30000); // 30000 ms = 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("this is running !!!");

      const data = await response.json();

      if (data.message) {
        setApiStatus("connected");
      } else {
        setApiStatus("disconnected");
      }
    } catch (error) {
      setApiStatus("disconnected");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUserData = async () => {
    try {
      setIsLoadingData(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userFiles = await getFiles({ userId: currentUser.$id });
        setFiles(userFiles.documents || []);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const getTestData = (fileId) => {
    const file = files.find((f) => f.$id === fileId);
    if (!file) return null;

    try {
      const result = JSON.parse(file.Result || "{}");
      const resultBiopsy = JSON.parse(file.resultBiopsy || "{}");
      const resultMedical = JSON.parse(file.resultMedical || "{}");
      const medical = JSON.parse(file.medicalData || "{}");

      return {
        fileName: file.name,
        imageAnalysis: {
          prediction: result.prediction,
          confidence: result.confidence,
        },
        biopsyAnalysis: {
          prediction: resultBiopsy.prediction,
          confidence: resultBiopsy.confidence,
        },
        riskAssessment: resultMedical.prediction,
        patientInfo: {
          age: medical.age,
          gender: medical.gender,
          country: medical.country,
        },
        riskFactors: {
          tobaccoUse: medical.tobaccoUse,
          alcoholUse: medical.alcoholUse,
          hpvInfection: medical.hpvInfection,
          familyHistory: medical.familyHistory,
        },
        symptoms: {
          oralLesions: medical.oralLesions,
          unexplainedBleeding: medical.unexplainedBleeding,
          difficultySwallowing: medical.difficultySwallowing,
          whitePatches: medical.whitePatches,
        },
      };
    } catch (error) {
      console.error("Error parsing test data:", error);
      return null;
    }
  };

  const generateAIResponse = async (prompt, testData) => {
    try {
      // Prepare the message with context if test data is available
      let contextualMessage = prompt;

      if (testData) {
        const contextInfo = `
Context: Analyzing test results for "${testData.fileName}"
- Image Analysis: ${testData.imageAnalysis.prediction} (${(
          testData.imageAnalysis.confidence * 100
        ).toFixed(1)}% confidence)
- Biopsy Analysis: ${testData.biopsyAnalysis.prediction || "N/A"}
- Risk Assessment: ${testData.riskAssessment || "N/A"}
- Patient Info: Age ${testData.patientInfo.age}, Gender ${
          testData.patientInfo.gender
        }
- Risk Factors: Tobacco: ${testData.riskFactors.tobaccoUse}, Alcohol: ${
          testData.riskFactors.alcoholUse
        }, HPV: ${testData.riskFactors.hpvInfection}, Family History: ${
          testData.riskFactors.familyHistory
        }
- Symptoms: Oral Lesions: ${testData.symptoms.oralLesions}, Bleeding: ${
          testData.symptoms.unexplainedBleeding
        }, Swallowing: ${
          testData.symptoms.difficultySwallowing
        }, White Patches: ${testData.symptoms.whitePatches}

User Question: ${prompt}

Please provide a personalized response based on this specific test data and patient information.`;

        contextualMessage = contextInfo;
      }

      // Call the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: contextualMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Update API status on successful response
      setApiStatus("connected");

      // Return the AI response
      return (
        data.response ||
        "I apologize, but I couldn't generate a response at this time."
      );
    } catch (error) {
      console.error("Error calling chatbot API:", error);

      // Update API status on error
      setApiStatus("disconnected");

      // Fallback to local responses if API fails
      const fallbackResponses = [
        {
          condition:
            prompt.toLowerCase().includes("risk") ||
            prompt.toLowerCase().includes("factor"),
          response: testData
            ? `Based on your test results for "${
                testData.fileName
              }", I can analyze your risk factors. Your image analysis shows ${
                testData.imageAnalysis.prediction
              } with ${(testData.imageAnalysis.confidence * 100).toFixed(
                1
              )}% confidence. ${
                testData.riskFactors.tobaccoUse === "yes"
                  ? "Your tobacco use significantly increases oral cancer risk."
                  : "Good news - you don't use tobacco, which reduces your risk."
              } ${
                testData.riskFactors.familyHistory === "yes"
                  ? "Family history indicates genetic predisposition to consider."
                  : ""
              } Overall risk assessment: ${testData.riskAssessment}.`
            : "Please select a test first so I can provide personalized risk analysis based on your specific results.",
        },
        {
          condition:
            prompt.toLowerCase().includes("symptom") ||
            prompt.toLowerCase().includes("sign"),
          response: testData
            ? `Looking at your symptoms from "${testData.fileName}": ${
                Object.entries(testData.symptoms)
                  .map(([key, value]) =>
                    value === "yes"
                      ? key.replace(/([A-Z])/g, " $1").toLowerCase()
                      : null
                  )
                  .filter(Boolean)
                  .join(", ") || "No concerning symptoms reported"
              }. ${
                testData.symptoms.oralLesions === "yes" ||
                testData.symptoms.whitePatches === "yes"
                  ? "The presence of lesions or patches requires monitoring."
                  : "The absence of visible symptoms is encouraging."
              } Continue regular screenings as recommended.`
            : "Please select a test to analyze your specific symptoms and provide personalized guidance.",
        },
        {
          condition:
            prompt.toLowerCase().includes("treatment") ||
            prompt.toLowerCase().includes("therapy"),
          response: testData
            ? `For your case (${
                testData.fileName
              }), treatment recommendations depend on your ${
                testData.imageAnalysis.prediction
              } diagnosis. ${
                testData.imageAnalysis.prediction
                  .toLowerCase()
                  .includes("cancer")
                  ? "Early intervention is crucial. Consult an oncologist immediately for staging and treatment planning."
                  : "Continue regular monitoring and maintain good oral hygiene."
              } Your ${
                testData.patientInfo.age
              } age and overall health status will influence treatment options.`
            : "Treatment advice requires reviewing your specific test results. Please select a test first.",
        },
        {
          condition:
            prompt.toLowerCase().includes("prevention") ||
            prompt.toLowerCase().includes("avoid"),
          response: testData
            ? `Based on your profile from "${
                testData.fileName
              }", here are prevention strategies: ${
                testData.riskFactors.tobaccoUse === "yes"
                  ? "Quitting tobacco is the most important step - this alone reduces risk by 50%."
                  : "Continue avoiding tobacco."
              } ${
                testData.riskFactors.alcoholUse === "yes"
                  ? "Limit alcohol consumption."
                  : ""
              } Maintain excellent oral hygiene, regular dental checkups, and a diet rich in fruits and vegetables. Given your ${
                testData.patientInfo.gender
              } gender and ${
                testData.patientInfo.age
              } age, continue regular screenings.`
            : "I can provide personalized prevention advice based on your test results. Please select a test first.",
        },
      ];

      const matchedResponse = fallbackResponses.find((r) => r.condition);
      if (matchedResponse) {
        return `⚠️ API temporarily unavailable. Fallback response: ${matchedResponse.response}`;
      }

      // Default fallback
      if (testData) {
        return `⚠️ API temporarily unavailable. However, based on your test "${
          testData.fileName
        }", your image analysis shows ${
          testData.imageAnalysis.prediction
        } with ${(testData.imageAnalysis.confidence * 100).toFixed(
          1
        )}% confidence. Risk assessment: ${
          testData.riskAssessment
        }. For detailed analysis, please try again when the service is available.`;
      } else {
        return "⚠️ I'm having trouble connecting to the AI service right now. Please try again in a moment, or select a test first for basic analysis.";
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const testData = selectedTest ? getTestData(selectedTest) : null;

      // Call the AI API (no artificial delay since real API will have its own response time)
      const aiResponse = await generateAIResponse(currentInput, testData);

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        testReference: testData?.fileName,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Failed to get AI response");

      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedTest("");
  };

  if (isLoadingData) {
    return (
      <div className="w-full flex h-full flex-1 flex-col justify-center items-center">
        <div className="relative">
          {/* Outer loader */}
          <Image
            src="/assets/icons/loader-brand.svg"
            alt="loader"
            width={48}
            height={48}
            className="animate-spin"
          />

          {/* Inner logo */}
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/assets/icons/Logo.png"
              alt="Logo"
              width={32}
              height={32} // Adjust size to fit nicely within the loader
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Image
                src="/assets/icons/chat-bot.svg"
                alt="AI Assistant"
                width={32}
                height={32}
                className="text-white nav-icon-mob size-14 brightness-0 invert"
              />
            </div>
            AI Medical Assistant
          </h1>
          <p className="text-slate-800 text-lg">
            Get personalized insights about your test results. Select a test and
            ask me anything!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar - Test Selection */}
          <div className="xl:col-span-1">
            <Card className="h-[600px] bg-slate-800 border-slate-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <div className="p-1.5 bg-gradient-to-r from-brand-100 to-teal-600 rounded-lg">
                    <Image
                      src="/assets/icons/documents.svg"
                      alt="Tests"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  Your Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <Select value={selectedTest} onValueChange={setSelectedTest}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select a test" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {files.length > 0 ? (
                        files.map((file) => (
                          <SelectItem
                            key={file.$id}
                            value={file.$id}
                            className="text-white hover:bg-slate-600"
                          >
                            {file.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem
                          value="no-tests"
                          disabled
                          className="text-gray-400"
                        >
                          No tests available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {selectedTest && (
                    <div className="p-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-800/30">
                      <p className="text-sm font-medium text-brand-200 mb-1">
                        Selected Test:
                      </p>
                      <p className="text-sm text-brand-100">
                        {files.find((f) => f.$id === selectedTest)?.name}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={clearChat}
                    className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    disabled={messages.length === 0}
                  >
                    Clear Chat
                  </Button>

                  {/* Quick Action Buttons */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">
                      Quick Questions:
                    </p>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 text-xs text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() =>
                          setInputMessage(
                            "What are the early signs of oral cancer?"
                          )
                        }
                        disabled={isLoading}
                      >
                        🔍 Early signs of oral cancer
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 text-xs text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() =>
                          setInputMessage("What are my risk factors?")
                        }
                        disabled={isLoading || !selectedTest}
                      >
                        ⚠️ My risk factors
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 text-xs text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() =>
                          setInputMessage("How can I prevent oral cancer?")
                        }
                        disabled={isLoading}
                      >
                        🛡️ Prevention tips
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 text-xs text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() =>
                          setInputMessage("Explain my test results")
                        }
                        disabled={isLoading || !selectedTest}
                      >
                        📊 Explain my results
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="xl:col-span-3">
            <Card className="h-[600px] flex flex-col bg-slate-800 border-slate-700 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
                      <Image
                        src="/assets/icons/info.svg"
                        alt="AI"
                        width={20}
                        height={20}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    Chat with AI Assistant
                    <div className="ml-auto flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          apiStatus === "connected"
                            ? "bg-emerald-400"
                            : apiStatus === "disconnected"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          apiStatus === "connected"
                            ? "text-emerald-400"
                            : apiStatus === "disconnected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {apiStatus === "connected"
                          ? "AI Online"
                          : apiStatus === "disconnected"
                          ? "AI Offline"
                          : "Checking..."}
                      </span>
                    </div>
                  </CardTitle>
                  {selectedTest && (
                    <span className="inline-flex items-center rounded-full border border-blue-600/30 px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-brand-200">
                      Analyzing:{" "}
                      {files.find((f) => f.$id === selectedTest)?.name}
                    </span>
                  )}
                </div>
              </CardHeader>

              <Separator className="bg-slate-700" />

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-900/50">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Image
                          src="/assets/icons/info.svg"
                          alt="AI Assistant"
                          width={48}
                          height={48}
                          className="filter brightness-0 invert opacity-60"
                        />
                      </div>
                      <p className="text-gray-400 mb-2">No messages yet</p>
                      <p className="text-sm text-gray-500">
                        Select a test and start asking questions about your
                        results!
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.type === "ai" && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Image
                            src="/assets/icons/info.svg"
                            alt="AI"
                            width={16}
                            height={16}
                            className="filter brightness-0 invert"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-3 rounded-lg shadow-lg ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12"
                            : "bg-slate-700 text-gray-100 mr-12 border border-slate-600"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {message.content.split("\n").map((line, index) => (
                            <p key={index} className={index > 0 ? "mt-2" : ""}>
                              {line}
                            </p>
                          ))}
                        </div>
                        {message.testReference && (
                          <div className="mt-3 pt-2 border-t border-slate-600">
                            <div className="flex items-center gap-1">
                              <Image
                                src="/assets/icons/documents.svg"
                                alt="Reference"
                                width={12}
                                height={12}
                                className="opacity-60 filter brightness-0 invert"
                              />
                              <p className="text-xs text-gray-400">
                                Reference: {message.testReference}
                              </p>
                            </div>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
                          <Image
                            src="/assets/icons/calendar.svg"
                            alt="Time"
                            width={10}
                            height={10}
                            className="opacity-50 filter brightness-0 invert"
                          />
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.type === "user" && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                          <Image
                            src="/assets/icons/dashboard.svg"
                            alt="User"
                            width={16}
                            height={16}
                            className="filter brightness-0 invert"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Image
                          src="/assets/icons/info.svg"
                          alt="AI"
                          width={16}
                          height={16}
                          className="filter brightness-0 invert"
                        />
                      </div>
                      <div className="max-w-[80%] p-3 rounded-lg bg-slate-700 mr-12 border border-slate-600 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/assets/icons/loader.svg"
                            alt="loading"
                            width={16}
                            height={16}
                            className="animate-spin filter brightness-0 invert"
                          />
                          <p className="text-sm text-gray-300">
                            AI is thinking...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              <Separator className="bg-slate-700" />

              {/* Input Area */}
              <div className="p-4 bg-slate-900/80">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        selectedTest
                          ? "Ask me about your test results, symptoms, risk factors..."
                          : "Select a test above to get personalized insights, or ask general questions..."
                      }
                      className="pr-12 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                      disabled={isLoading}
                      maxLength={500}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      {inputMessage.length}/500
                    </span>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    {isLoading ? (
                      <Image
                        src="/assets/icons/loader.svg"
                        alt="Loading"
                        width={16}
                        height={16}
                        className="animate-spin filter brightness-0 invert"
                      />
                    ) : (
                      <Image
                        src="/assets/icons/arrow-up.svg"
                        alt="Send"
                        width={16}
                        height={16}
                        className="filter brightness-0 invert"
                      />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">Press Enter to send</p>
                  {apiStatus === "disconnected" && (
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <Image
                        src="/assets/icons/close.svg"
                        alt="Warning"
                        width={12}
                        height={12}
                        className="filter brightness-0 invert"
                      />
                      <span>Using fallback responses</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

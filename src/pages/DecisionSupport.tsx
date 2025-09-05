import React, { useState } from "react"
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Ruler,
  ClipboardList,
  Bot,
} from "lucide-react"

// ---------- Types ----------
type Scheme = {
  name: string
  match: number
  description: string
  benefit: string
  timeline: string
}

type Risk = {
  type: string
  level: "High" | "Medium" | "Low"
}

type AnalysisReport = {
  beneficiaryName: string
  village: string
  landSize: number
  aiSummary: string
  schemes: Scheme[]
  risks: Risk[]
}

// ---------- Demo Data ----------
const beneficiaryData: Record<
  string,
  { name: string; landSize: number; familySize: number }
> = {
  Kondagaon: { name: "Ravi Kumar", landSize: 2.5, familySize: 5 },
  Bastar: { name: "Sunita Devi", landSize: 3.0, familySize: 4 },
  Kanker: { name: "Mangal Singh", landSize: 1.5, familySize: 6 },
}

// ---------- AI Report Component ----------
interface ReportProps {
  report: AnalysisReport | null
  onClear: () => void
}

function AIAnalysisReport({ report, onClear }: ReportProps) {
  if (!report) return null

  return (
    <div className="p-6 shadow-md rounded-xl border bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <ClipboardList className="w-5 h-5 mr-2 text-gray-700" />
          AI Analysis Report
        </h2>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:underline"
        >
          × Clear
        </button>
      </div>

      {/* Beneficiary Info */}
      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center text-gray-800">
          <User size={16} className="mr-2 text-gray-600" />
          <strong className="text-gray-900">Beneficiary:</strong>
          <span className="ml-2 text-gray-800">{report.beneficiaryName}</span>
        </div>
        <div className="flex items-center text-gray-800">
          <MapPin size={16} className="mr-2 text-gray-600" />
          <strong className="text-gray-900">Village:</strong>
          <span className="ml-2 text-gray-800">{report.village}</span>
        </div>
        <div className="flex items-center text-gray-800">
          <Ruler size={16} className="mr-2 text-gray-600" />
          <strong className="text-gray-900">Land Size:</strong>
          <span className="ml-2 text-gray-800">{report.landSize} Ha</span>
        </div>
      </div>

      <hr className="my-4" />

      {/* AI Summary */}
      <h3 className="text-md font-semibold text-gray-900 flex items-center mb-2">
        <ClipboardList className="w-4 h-4 mr-2 text-gray-700" />
        AI Summary & Recommendations
      </h3>
      <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded-md border">
        {report.aiSummary}
      </p>

      {/* Schemes & Risks */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Eligible Schemes */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 flex items-center mb-2">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Eligible Schemes
          </h3>
          {report.schemes.map((scheme, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 mb-3 bg-white hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-gray-900">{scheme.name}</h4>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {scheme.match}% match
                </span>
              </div>
              <p className="text-sm text-gray-800">{scheme.description}</p>
              <p className="text-sm text-green-700 font-semibold">
                {scheme.benefit}
              </p>
              <p className="text-xs text-gray-700 mt-1">
                Timeline: <strong>{scheme.timeline}</strong>
              </p>
            </div>
          ))}
        </div>

        {/* Risk Assessment */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
            Risk Assessment
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {report.risks.map((risk, index) => (
              <div
                key={index}
                className="flex justify-between items-center border rounded p-2"
              >
                <span className="text-gray-800">{risk.type}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    risk.level === "High"
                      ? "bg-red-500 text-white"
                      : risk.level === "Medium"
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-300 text-gray-900"
                  }`}
                >
                  {risk.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Main Component ----------
export default function DecisionSupport() {
  const [selectedVillage, setSelectedVillage] = useState("Kondagaon")
  const [isLoading, setIsLoading] = useState(false)
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(
    null
  )

  const handleRunAnalysis = () => {
    setIsLoading(true)
    setAnalysisReport(null)

    setTimeout(() => {
      const data = beneficiaryData[selectedVillage]
      const report: AnalysisReport = {
        beneficiaryName: data.name,
        village: selectedVillage,
        landSize: data.landSize,
        aiSummary: `Based on the provided data for ${data.name}, the AI recommends prioritizing the PM-KISAN scheme due to the land holding size. Water scarcity is a significant risk, suggesting Jal Jeevan Mission as a secondary focus.`,
        schemes: [
          {
            name: "PM-KISAN",
            match: 95,
            description: "Small & Marginal Farmer",
            benefit: "₹6,000/year",
            timeline: "2 weeks",
          },
          {
            name: "Jal Jeevan Mission",
            match: 88,
            description: "Rural Household",
            benefit: "Water Connection",
            timeline: "3 months",
          },
        ],
        risks: [
          {
            type: "Water Scarcity",
            level: data.landSize > 2 ? "High" : "Medium",
          },
          { type: "Market Access", level: "Low" },
        ],
      }

      setAnalysisReport(report)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI Decision Support System
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Smart recommendations for FRA implementation and scheme allocation
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          <Zap size={14} />
          <span>AI Powered</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-2">
          Configure Analysis
        </h3>
        <label className="text-sm font-medium text-gray-800">
          Select Beneficiary (by Village)
        </label>
        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Kondagaon">Ravi Kumar (Kondagaon)</option>
          <option value="Bastar">Sunita Devi (Bastar)</option>
          <option value="Kanker">Mangal Singh (Kanker)</option>
        </select>

        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="mt-4 w-full bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors disabled:bg-gray-500"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>Run AI Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Report */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg border border-gray-200">
          <Bot size={40} className="text-blue-500 animate-bounce" />
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Generating AI Report...
          </p>
          <p className="text-sm text-gray-700">This may take a few moments.</p>
        </div>
      ) : (
        <AIAnalysisReport
          report={analysisReport}
          onClear={() => setAnalysisReport(null)}
        />
      )}
    </div>
  )
}

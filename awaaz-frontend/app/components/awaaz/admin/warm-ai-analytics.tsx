'use client'

import { useState } from 'react'
import {
  Sparkles, TrendingUp, Clock, AlertTriangle, CheckCircle2, Layers,
  MapPin, Lightbulb, ArrowUpRight, Check, RefreshCw
} from 'lucide-react'
import { ANALYTICS_BY_AREA } from '@/lib/warm-analytics-data'

export function WarmAiAnalytics() {
  const [selectedArea, setSelectedArea] = useState<string>('All Wards')
  const [timeRange, setTimeRange] = useState<string>('Last 7 Days')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dataStore, setDataStore] = useState(ANALYTICS_BY_AREA)

  const currentData = dataStore[selectedArea] || dataStore['All Wards']

  const handleMergeCluster = (clusterId: string) => {
    setDataStore(prev => {
      const areaObj = { ...prev[selectedArea] }
      areaObj.clusters = areaObj.clusters.map(c => c.id === clusterId ? { ...c, merged: true } : c)
      return { ...prev, [selectedArea]: areaObj }
    })
  }

  const handleDispatchRec = (recId: string) => {
    setDataStore(prev => {
      const areaObj = { ...prev[selectedArea] }
      areaObj.recommendations = areaObj.recommendations.map(r => r.id === recId ? { ...r, status: 'Dispatched' } : r)
      return { ...prev, [selectedArea]: areaObj }
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Area Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Analytics &amp; Predictive Insights</h1>
          <p className="text-sm text-gray-500">Autonomous pattern recognition &amp; localized predictive ML reports</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Area Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#EAE5D9] shadow-sm">
            <MapPin size={14} className="text-[#2E6F65]" />
            <span className="text-xs font-bold text-gray-600">Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-xs font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
            >
              <option value="All Wards">All Wards / City-wide</option>
              <option value="Sector 14, Gurugram">Sector 14, Gurugram</option>
              <option value="Ward 22, Jaipur">Ward 22, Jaipur</option>
            </select>
          </div>

          {/* Time Range */}
          <div className="bg-white px-3 py-2 rounded-xl border border-[#EAE5D9] shadow-sm">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-[#EAE5D9] rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-600"
            title="Re-run ML Analysis"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#2E6F65]' : ''} />
          </button>
        </div>
      </div>

      {/* 1. AI Executive Summary */}
      <div className="p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-[#2E6F65]/10 rounded-xl text-[#2E6F65]">
            <Sparkles size={18} />
          </div>
          <h3 className="font-bold text-base text-gray-900">AI Executive Summary</h3>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#2E6F65] text-white px-2 py-0.5 rounded-full">
            Autonomous ML Model
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed max-w-4xl">{currentData.summary}</p>

        <div className="mt-4 pt-3 border-t border-[#EAE5D9] flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Predicted Public Satisfaction:</span>
            <span className="font-bold text-[#2E6F65] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {currentData.sentimentScore}% Positive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">ML Confidence:</span>
            <span className="font-bold text-gray-900">93.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Active Locality:</span>
            <span className="font-bold text-gray-900">{selectedArea}</span>
          </div>
        </div>
      </div>

      {/* 2 & 3: Department Performance + SLA Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Performance */}
        <div className="lg:col-span-2 p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-base text-gray-900">Department Performance</h3>
              <p className="text-xs text-gray-500">Resolution Rate &amp; Average Resolution Speed</p>
            </div>
            <TrendingUp size={16} className="text-[#2E6F65]" />
          </div>

          <div className="space-y-4">
            {currentData.departments.map((dept, idx) => (
              <div key={idx} className="p-3 bg-gray-50/70 rounded-xl border border-[#EAE5D9]/70">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-gray-900">{dept.name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">{dept.resolved} / {dept.total} resolved</span>
                    <span className="font-bold text-[#2E6F65]">{dept.resolutionRate}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-[#2E6F65] h-full rounded-full transition-all duration-500" style={{ width: `${dept.resolutionRate}%` }} />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Clock size={12} className="text-gray-400" />
                  <span>Avg. Resolution Time: <strong>{dept.avgTimeHours} hrs</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Risk & Breached Analysis */}
        <div className="p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-gray-900">SLA Risk Assessment</h3>
              <AlertTriangle size={16} className="text-orange-500" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-700 uppercase">On-Track</p>
                <p className="text-xl font-extrabold text-emerald-800">{currentData.slaAnalysis.onTrack}</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[10px] font-bold text-amber-700 uppercase">At-Risk</p>
                <p className="text-xl font-extrabold text-amber-800">{currentData.slaAnalysis.atRisk}</p>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-[10px] font-bold text-rose-700 uppercase">Breached</p>
                <p className="text-xl font-extrabold text-rose-800">{currentData.slaAnalysis.breached}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-[#EAE5D9] text-xs">
              <p className="font-bold text-gray-700 mb-1">Primary Bottleneck Identified:</p>
              <p className="text-gray-600 leading-relaxed">{currentData.slaAnalysis.bottleneckReason}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE5D9]">
            <p className="text-[11px] text-gray-400">AI monitors SLA timelines every 15 minutes.</p>
          </div>
        </div>

      </div>

      {/* 4 & 5: Duplicate Complaint Clusters + Area Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Duplicate Complaint Clusters */}
        <div className="p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">Duplicate Complaint Clusters</h3>
              <p className="text-xs text-gray-500">Multiple citizen calls grouped into single incident</p>
            </div>
            <Layers size={16} className="text-[#E5A040]" />
          </div>

          <div className="space-y-3">
            {currentData.clusters.map((cluster) => (
              <div key={cluster.id} className="p-3.5 bg-gray-50 rounded-xl border border-[#EAE5D9] flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-[#E5A040]/15 text-[#E5A040] px-2 py-0.5 rounded-md">
                      {cluster.id} · {cluster.count} Reports
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      {cluster.similarityScore}% semantic match
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{cluster.issue}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} /> {cluster.location}
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  {cluster.merged ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Check size={12} /> Merged into 1 Work Order
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMergeCluster(cluster.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6F65] bg-white border border-[#2E6F65]/30 hover:bg-[#2E6F65] hover:text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Merge Reports
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Hotspots */}
        <div className="p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">Complaint Hotspots &amp; Density</h3>
              <p className="text-xs text-gray-500">Spatial frequency of recurring community issues</p>
            </div>
            <MapPin size={16} className="text-[#2E6F65]" />
          </div>

          <div className="space-y-2.5">
            {currentData.hotspots.map((spot, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl border border-[#EAE5D9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    spot.riskLevel === 'High' ? 'bg-rose-500 ring-2 ring-rose-200' : 'bg-amber-500 ring-2 ring-amber-200'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{spot.area}</p>
                    <p className="text-[11px] text-gray-500">Dominant: {spot.dominantIssue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">{spot.activeTickets}</span>
                  <span className="text-[10px] text-gray-400 block">active tickets</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. AI Recommendations & At-Risk Cases (Proposed Solutions) */}
      <div className="p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-[#E5A040]/15 rounded-xl text-[#E5A040]">
            <Lightbulb size={18} />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">AI Recommendations &amp; Proposed Solutions</h3>
            <p className="text-xs text-gray-500">Proactive actions proposed by ML model to reduce recurrence</p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {currentData.recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-gray-50 rounded-xl border border-[#EAE5D9] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                    {rec.id}
                  </span>
                  <span className="text-xs font-bold text-gray-900">{rec.issueIdentified}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Proposed Solution:</strong> {rec.proposedSolution}
                </p>
                <p className="text-[11px] font-semibold text-emerald-700">
                  Impact: {rec.estimatedImpact}
                </p>
              </div>

              <div className="shrink-0">
                {rec.status === 'Dispatched' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={14} /> Dispatched to JE
                  </span>
                ) : (
                  <button
                    onClick={() => handleDispatchRec(rec.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E6F65] hover:bg-[#245a52] px-3.5 py-2 rounded-xl shadow-sm transition-colors"
                  >
                    <span>Dispatch Solution</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

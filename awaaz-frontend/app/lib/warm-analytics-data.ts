export type AreaAnalytics = {
  ward: string
  summary: string
  sentimentScore: number // percentage positive
  departments: {
    name: string
    total: number
    resolved: number
    resolutionRate: number // %
    avgTimeHours: number
  }[]
  slaAnalysis: {
    onTrack: number
    atRisk: number
    breached: number
    bottleneckReason: string
  }
  clusters: {
    id: string
    issue: string
    count: number
    similarityScore: number
    location: string
    merged: boolean
  }[]
  hotspots: {
    area: string
    riskLevel: 'High' | 'Medium' | 'Low'
    dominantIssue: string
    activeTickets: number
  }[]
  recommendations: {
    id: string
    issueIdentified: string
    proposedSolution: string
    estimatedImpact: string
    status: 'Pending' | 'Dispatched'
  }[]
}

export const ANALYTICS_BY_AREA: Record<string, AreaAnalytics> = {
  'All Wards': {
    ward: 'All Wards',
    summary: 'Water Department carries 62% of grievances. Repeated pipeline disruptions detected in Sector 14. Sanitation response improved by 18% over the last week.',
    sentimentScore: 78,
    departments: [
      { name: 'Water & Sanitation', total: 42, resolved: 31, resolutionRate: 74, avgTimeHours: 14.5 },
      { name: 'Electricity Board', total: 28, resolved: 24, resolutionRate: 86, avgTimeHours: 8.2 },
      { name: 'Sanitation / Municipal', total: 35, resolved: 26, resolutionRate: 74, avgTimeHours: 11.0 },
      { name: 'Roads & PWD', total: 19, resolved: 12, resolutionRate: 63, avgTimeHours: 28.4 },
    ],
    slaAnalysis: {
      onTrack: 96,
      atRisk: 18,
      breached: 10,
      bottleneckReason: 'Field crew shortage during peak morning hours in Sector 14 & Ward 22.',
    },
    clusters: [
      { id: 'CL-01', issue: 'Main distribution pipeline leakage near Market Gate', count: 14, similarityScore: 94, location: 'Sector 14, Gurugram', merged: false },
      { id: 'CL-02', issue: 'Street light circuit trip on Outer Ring Road', count: 8, similarityScore: 89, location: 'Ward 22, Jaipur', merged: false },
      { id: 'CL-03', issue: 'Garbage accumulation near community park', count: 6, similarityScore: 82, location: 'Charminar, Hyderabad', merged: true },
    ],
    hotspots: [
      { area: 'Sector 14 (Gurugram)', riskLevel: 'High', dominantIssue: 'Water Outage', activeTickets: 19 },
      { area: 'Ward 22 (Jaipur)', riskLevel: 'Medium', dominantIssue: 'Street Lighting', activeTickets: 9 },
      { area: 'Charminar (Hyderabad)', riskLevel: 'Medium', dominantIssue: 'Waste Clearance', activeTickets: 8 },
      { area: 'Kurla (Mumbai)', riskLevel: 'High', dominantIssue: 'Drain Overflow', activeTickets: 12 },
    ],
    recommendations: [
      {
        id: 'REC-101',
        issueIdentified: 'Sector 14 pipeline shows pressure bursts every 10-12 days.',
        proposedSolution: 'Install automated pressure relief valve on main junction; deploy preventative inspection before weekend peak.',
        estimatedImpact: 'Predicts 65% drop in water grievances',
        status: 'Pending',
      },
      {
        id: 'REC-102',
        issueIdentified: 'Sanitation trucks skipping secondary lanes in Ward 22.',
        proposedSolution: 'Re-route morning collection vehicles with mandatory GPS geofence checkpoint alerts.',
        estimatedImpact: 'Reduces backlog tickets by 40%',
        status: 'Pending',
      },
    ],
  },
  'Sector 14, Gurugram': {
    ward: 'Sector 14, Gurugram',
    summary: 'High density of water outage reports. AI detected repetitive burst frequency tied to high-pressure morning cycling.',
    sentimentScore: 68,
    departments: [
      { name: 'Water & Sanitation', total: 24, resolved: 15, resolutionRate: 62, avgTimeHours: 19.2 },
      { name: 'Sanitation / Municipal', total: 8, resolved: 7, resolutionRate: 88, avgTimeHours: 9.0 },
    ],
    slaAnalysis: {
      onTrack: 22,
      atRisk: 7,
      breached: 3,
      bottleneckReason: 'Replacement pipe parts in transit from central depot.',
    },
    clusters: [
      { id: 'CL-01', issue: 'Main distribution pipeline leakage near Market Gate', count: 14, similarityScore: 94, location: 'Sector 14, Gurugram', merged: false },
    ],
    hotspots: [
      { area: 'Sector 14 Market Zone', riskLevel: 'High', dominantIssue: 'Water Pressure', activeTickets: 14 },
      { area: 'Sector 14 Block C', riskLevel: 'Medium', dominantIssue: 'Drainage', activeTickets: 5 },
    ],
    recommendations: [
      {
        id: 'REC-101',
        issueIdentified: 'Sector 14 pipeline shows pressure bursts every 10-12 days.',
        proposedSolution: 'Install automated pressure relief valve on main junction; deploy preventative inspection before weekend peak.',
        estimatedImpact: 'Predicts 65% drop in water grievances',
        status: 'Pending',
      },
    ],
  },
  'Ward 22, Jaipur': {
    ward: 'Ward 22, Jaipur',
    summary: 'Electrical repairs on schedule. Road maintenance delayed due to local contractor backlog.',
    sentimentScore: 84,
    departments: [
      { name: 'Electricity Board', total: 16, resolved: 14, resolutionRate: 87, avgTimeHours: 7.5 },
      { name: 'Roads & PWD', total: 6, resolved: 3, resolutionRate: 50, avgTimeHours: 32.0 },
    ],
    slaAnalysis: {
      onTrack: 17,
      atRisk: 3,
      breached: 2,
      bottleneckReason: 'PWD asphalt allocation pending.',
    },
    clusters: [
      { id: 'CL-02', issue: 'Street light circuit trip on Outer Ring Road', count: 8, similarityScore: 89, location: 'Ward 22, Jaipur', merged: false },
    ],
    hotspots: [
      { area: 'Ward 22 Park Avenue', riskLevel: 'Medium', dominantIssue: 'Street Lighting', activeTickets: 8 },
    ],
    recommendations: [
      {
        id: 'REC-102',
        issueIdentified: 'Secondary lane lighting cables corroded near park zone.',
        proposedSolution: 'Replace standard insulated wiring with weatherproof underground cable sheath.',
        estimatedImpact: 'Eliminates 80% monsoon trip incidents',
        status: 'Pending',
      },
    ],
  },
}

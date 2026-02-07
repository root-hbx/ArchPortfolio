'use client'

export default function About() {
  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text overflow-y-auto p-6 text-sm leading-relaxed">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-arch-blue mb-1">Boxuan Hu</h1>
          <p className="text-ctp-subtext0">Computer Science Undergraduate & Research Assistant</p>
        </div>

        {/* About */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-ctp-mauve mb-2 border-b border-ctp-surface0 pb-1">About</h2>
          <p className="text-ctp-subtext1">
            I am a senior undergraduate student in Computer Science at Xi&apos;an Jiaotong University (XJTU).
            My research interests lie in <span className="text-ctp-green">computer systems and networks</span>.
            I have been fortunate to work as a research assistant at the Sky Computing Lab at UC Berkeley
            and the ANTS Group at XJTU.
          </p>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-ctp-mauve mb-2 border-b border-ctp-surface0 pb-1">Education</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-ctp-text">Xi&apos;an Jiaotong University (XJTU)</span>
                <span className="text-ctp-overlay0 text-xs">2022 - 2026</span>
              </div>
              <p className="text-ctp-subtext0">B.Sc. in Computer Science and Technology</p>
            </div>
            <div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-ctp-text">UC Berkeley</span>
                <span className="text-ctp-overlay0 text-xs">2024</span>
              </div>
              <p className="text-ctp-subtext0">Visiting Student - Sky Computing Lab</p>
            </div>
            <div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-ctp-text">National University of Singapore (NUS)</span>
                <span className="text-ctp-overlay0 text-xs">2024</span>
              </div>
              <p className="text-ctp-subtext0">Visiting Student - NUS School of Computing Bronze Medal</p>
            </div>
          </div>
        </section>

        {/* Research Experience */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-ctp-mauve mb-2 border-b border-ctp-surface0 pb-1">Research Experience</h2>
          <div className="space-y-3">
            <div>
              <span className="font-bold text-ctp-text">Sky Computing Lab, UC Berkeley</span>
              <p className="text-ctp-subtext0">Research Assistant - Cloud computing and distributed systems</p>
            </div>
            <div>
              <span className="font-bold text-ctp-text">ANTS Group, Xi&apos;an Jiaotong University</span>
              <p className="text-ctp-subtext0">Research Assistant - Network systems, distributed computing</p>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-ctp-mauve mb-2 border-b border-ctp-surface0 pb-1">Links</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'GitHub', url: 'https://github.com/root-hbx', display: 'github.com/root-hbx' },
              { label: 'Website', url: 'https://bxhu2004.com', display: 'bxhu2004.com' },
              { label: 'Telegram', url: 'https://t.me/root_hbx', display: 't.me/root_hbx' },
              { label: 'LinkedIn', url: 'https://linkedin.com/in/boxuan-hu', display: 'linkedin.com/in/boxuan-hu' },
              { label: 'OpenReview', url: 'https://openreview.net', display: 'openreview.net' },
              { label: 'ResearchGate', url: 'https://researchgate.net', display: 'researchgate.net' },
              { label: 'ORCID', url: 'https://orcid.org', display: 'orcid.org' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-arch-blue hover:text-ctp-sapphire transition-colors"
              >
                <span className="text-ctp-overlay0">{link.label}:</span>
                <span className="underline">{link.display}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-bold text-ctp-mauve mb-2 border-b border-ctp-surface0 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {['Python', 'C/C++', 'Rust', 'Go', 'TypeScript', 'Linux', 'Docker', 'Kubernetes', 'Git'].map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-ctp-surface0 rounded text-xs text-ctp-subtext1"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

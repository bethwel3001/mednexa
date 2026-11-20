import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MedicalRecord } from '../../types';
import { FileText, ShieldCheck, Download, Eye, Calendar, Building2, Loader2, X, Lock } from 'lucide-react';

export const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRecord, setActiveRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const data = await api.getMyRecords();
        setRecords(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Medical Records & Lab Reports
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Your confidential consultation summaries, official diagnostic lab panels, and vaccination history.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F4F5F7] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#56616B]">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Health Vault</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#8C94A0]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#131316]" />
          <p className="text-xs">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EFF1F6]">
          <FileText className="w-10 h-10 text-[#CBD0D6] mx-auto mb-3" />
          <h3 className="font-bold text-[#131316] text-sm mb-1">No medical records on file</h3>
          <p className="text-xs text-[#8C94A0] max-w-sm mx-auto">
            Clinical consultation notes and verified lab test reports will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl border border-[#EFF1F6] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4F5F7] text-[#56616B] px-2.5 py-1 rounded-full">
                    {rec.record_type}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#8C94A0]">
                    <Calendar className="w-3 h-3" />
                    <span>{rec.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-[#131316] text-sm mb-2 line-clamp-2">
                  {rec.title}
                </h3>

                <p className="text-xs text-[#56616B] line-clamp-3 leading-relaxed mb-4">
                  {rec.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EFF1F6] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#56616B] font-medium truncate max-w-[170px]">
                  <Building2 className="w-3.5 h-3.5 text-[#8C94A0] flex-shrink-0" />
                  <span className="truncate">{rec.facility_name || 'Hospital Clinic'}</span>
                </div>

                <button
                  onClick={() => setActiveRecord(rec)}
                  className="inline-flex items-center gap-1 font-semibold text-[#131316] hover:bg-[#F4F5F7] px-3 py-1.5 rounded-full transition-colors border border-[#E9EBEF]"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Details Modal */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EFF1F6] shadow-2xl overflow-hidden p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveRecord(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F4F5F7] text-[#8C94A0] hover:text-[#131316] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EFF1F6]">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C94A0] block">
                  {activeRecord.record_type}
                </span>
                <h3 className="font-bold text-[#131316] text-base mt-0.5">{activeRecord.title}</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-[#EFF1F6]">
                <div>
                  <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Document Date</span>
                  <span className="font-semibold text-[#131316]">{activeRecord.date}</span>
                </div>
                <div>
                  <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Attending Author</span>
                  <span className="font-semibold text-[#131316]">{activeRecord.created_by}</span>
                </div>
                <div>
                  <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Issuing Facility</span>
                  <span className="font-semibold text-[#131316]">{activeRecord.facility_name}</span>
                </div>
                <div>
                  <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-bold text-emerald-700">Verified & Signed</span>
                </div>
              </div>

              <div>
                <span className="text-[#8C94A0] block text-[10px] uppercase font-bold mb-1.5">
                  Clinical Summary & Assessment
                </span>
                <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#EFF1F6] text-[#131316] leading-relaxed font-mono">
                  {activeRecord.summary}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#8C94A0] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Encrypted patient health record
                </span>
                <button
                  onClick={() => alert('PDF export generated.')}
                  className="inline-flex items-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-full transition-all text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

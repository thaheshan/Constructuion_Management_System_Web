'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateCompanyDetails,
  setStep,
  saveDraftSuccess,
} from '@/store/slices/ownerOnboardingSlice';
import { DistrictSelector } from './DistrictSelector';
import { LogoUploadZone } from './LogoUploadZone';
import { SaveDraftModal } from './SaveDraftModal';
import { SriLankanDistrict } from '@/types/onboarding';
import {
  Briefcase,
  MapPin,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

interface OwnerStep2CompanyDetailsProps {
  onOpenHelp?: () => void;
}

export const OwnerStep2CompanyDetails: React.FC<OwnerStep2CompanyDetailsProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );
  const ownerDetails = useAppSelector(
    (state) => state.ownerOnboarding.ownerDetails
  );

  // Form local state
  const [companyName, setCompanyName] = useState(companyDetails.companyName || '');
  const [businessType, setBusinessType] = useState(
    companyDetails.businessType || ''
  );
  const [businessRegNo, setBusinessRegNo] = useState(
    companyDetails.businessRegNo || ''
  );
  const [companyPhonePrefix, setCompanyPhonePrefix] = useState(
    companyDetails.companyPhonePrefix || '+94'
  );
  const [companyPhone, setCompanyPhone] = useState(
    companyDetails.companyPhone || ''
  );
  const [companyEmail, setCompanyEmail] = useState(
    companyDetails.companyEmail || ''
  );
  const [addressLine, setAddressLine] = useState(
    companyDetails.addressLine || ''
  );
  const [city, setCity] = useState(companyDetails.city || '');
  const [district, setDistrict] = useState<SriLankanDistrict | ''>(
    companyDetails.district || 'Colombo'
  );

  // Tax & Statutory
  const [vatTinNumber, setVatTinNumber] = useState(
    companyDetails.vatTinNumber || ''
  );
  const [epfEmployerNo, setEpfEmployerNo] = useState(
    companyDetails.epfEmployerNo || ''
  );
  const [etfEmployerNo, setEtfEmployerNo] = useState(
    companyDetails.etfEmployerNo || ''
  );
  const [isVatRegistered, setIsVatRegistered] = useState(
    companyDetails.isVatRegistered || false
  );
  const [taxSectionExpanded, setTaxSectionExpanded] = useState(true);

  // Preferences & Assets
  const [currency, setCurrency] = useState(
    companyDetails.currency || 'LKR Rs. (Sri Lankan Rupee)'
  );
  const [financialYearStart, setFinancialYearStart] = useState(
    companyDetails.financialYearStart || '1 April'
  );
  const [logoBase64, setLogoBase64] = useState<string | undefined>(
    companyDetails.logoBase64
  );
  const [logoFileName, setLogoFileName] = useState<string | undefined>(
    companyDetails.logoFileName
  );

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Save draft modal state
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!companyName.trim()) {
      errs.companyName = 'Company name is required';
    } else if (companyName.trim().length < 2) {
      errs.companyName = 'Company name must be at least 2 characters';
    }

    if (!businessType.trim()) {
      errs.businessType = 'Business type is required';
    }

    const cleanCompanyPhone = companyPhone.replace(/\s+/g, '');
    if (!cleanCompanyPhone) {
      errs.companyPhone = 'Company phone number is required';
    } else if (!/^[0-9]{8,10}$/.test(cleanCompanyPhone)) {
      errs.companyPhone = 'Enter a valid landline or mobile number (e.g. 11 234 5678)';
    }

    if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim())) {
      errs.companyEmail = 'Please enter a valid company email address';
    }

    if (!addressLine.trim()) {
      errs.addressLine = 'Office street address is required';
    }

    if (!city.trim()) {
      errs.city = 'City is required';
    }

    if (!district) {
      errs.district = 'Please select a district';
    }

    // Optional field formats if provided
    if (businessRegNo && !/^[A-Za-z0-9\-/]+$/.test(businessRegNo.trim())) {
      errs.businessRegNo = 'Business Registration Number contains invalid characters';
    }

    if (vatTinNumber && !/^[A-Za-z0-9\-]+$/.test(vatTinNumber.trim())) {
      errs.vatTinNumber = 'VAT/TIN format is invalid (e.g. 123456789-8000)';
    }

    return errs;
  };

  const syncToRedux = () => {
    dispatch(
      updateCompanyDetails({
        companyName: companyName.trim(),
        businessType: businessType.trim(),
        businessRegNo: businessRegNo.trim(),
        companyPhonePrefix,
        companyPhone: companyPhone.trim(),
        companyEmail: companyEmail.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        district: district as SriLankanDistrict,
        vatTinNumber: vatTinNumber.trim(),
        epfEmployerNo: epfEmployerNo.trim(),
        etfEmployerNo: etfEmployerNo.trim(),
        isVatRegistered,
        currency,
        financialYearStart,
        logoBase64,
        logoFileName,
      })
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      companyName: true,
      businessType: true,
      companyPhone: true,
      addressLine: true,
      city: true,
      district: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      syncToRedux();
      dispatch(setStep(3));
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('step', '3');
        window.history.pushState({}, '', url.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    syncToRedux();
    dispatch(setStep(1));
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('step', '1');
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = () => {
    syncToRedux();
    const timestamp = new Date().toISOString();
    setSavedTimestamp(timestamp);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const draftPayload = {
          currentStep: 2,
          ownerDetails,
          companyDetails: {
            companyName: companyName.trim(),
            businessType,
            businessRegNo: businessRegNo.trim(),
            companyPhonePrefix,
            companyPhone: companyPhone.trim(),
            companyEmail: companyEmail.trim(),
            addressLine: addressLine.trim(),
            city: city.trim(),
            district,
            vatTinNumber: vatTinNumber.trim(),
            epfEmployerNo: epfEmployerNo.trim(),
            etfEmployerNo: etfEmployerNo.trim(),
            isVatRegistered,
            currency,
            financialYearStart,
            logoBase64,
            logoFileName,
          },
          lastSavedAt: timestamp,
        };
        localStorage.setItem(
          'futura_owner_onboarding_draft',
          JSON.stringify(draftPayload)
        );
        dispatch(saveDraftSuccess());
        setShowDraftModal(true);
      } catch (err) {
        console.error('Failed to save onboarding draft to localStorage', err);
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  return (
    <div className="w-full">
      {/* ── Main Form Card ── */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-7 sm:p-9">
        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tell us about your company
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            These details appear on invoices, payslips and tax reports. You can edit them later in Settings.
          </p>
        </div>

        <form onSubmit={handleContinue} noValidate className="space-y-6">
          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 1: BUSINESS INFORMATION */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-800">
                Business Information
              </h2>
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={() => handleBlur('companyName')}
                placeholder="Futura Constructions (Pvt) Ltd"
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.companyName && errors.companyName
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                }`}
              />
              {touched.companyName && errors.companyName && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.companyName}</span>
                </p>
              )}
            </div>

            {/* Business Type & Business Reg No Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Type */}
              <div>
                <label
                  htmlFor="businessType"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  Business Type
                </label>
                <input
                  id="businessType"
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  onBlur={() => handleBlur('businessType')}
                  placeholder="Private limited company"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                    touched.businessType && errors.businessType
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                      : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                  }`}
                />
                {touched.businessType && errors.businessType && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.businessType}</span>
                  </p>
                )}
              </div>

              {/* Business Reg No */}
              <div>
                <label
                  htmlFor="businessRegNo"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  Business Reg No (Optional)
                </label>
                <input
                  id="businessRegNo"
                  type="text"
                  value={businessRegNo}
                  onChange={(e) => setBusinessRegNo(e.target.value)}
                  placeholder="PV-123456"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                />
              </div>
            </div>

            {/* Company Phone & Company Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Phone */}
              <div>
                <label
                  htmlFor="companyPhone"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  Company Phone
                </label>
                <div
                  className={`flex items-center rounded-xl border transition focus-within:ring-2 focus-within:ring-futura-500 bg-white overflow-hidden ${
                    touched.companyPhone && errors.companyPhone
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-600 pl-4 pr-3 py-2.5 select-none">
                    +94
                  </span>
                  <div className="h-4 w-[1px] bg-slate-200 my-auto flex-shrink-0" />
                  <input
                    id="companyPhone"
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    onBlur={() => handleBlur('companyPhone')}
                    placeholder="11 234 5678"
                    className="flex-1 px-3 py-2.5 text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                {touched.companyPhone && errors.companyPhone && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.companyPhone}</span>
                  </p>
                )}
              </div>

              {/* Company Email */}
              <div>
                <label
                  htmlFor="companyEmail"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  Company Email (Optional)
                </label>
                <input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  onBlur={() => handleBlur('companyEmail')}
                  placeholder="contact@futura.lk"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                    touched.companyEmail && errors.companyEmail
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                      : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                  }`}
                />
                {touched.companyEmail && errors.companyEmail && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.companyEmail}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 2: ADDRESS */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-800">
                Address
              </h2>
            </div>

            {/* Address Line */}
            <div>
              <label
                htmlFor="addressLine"
                className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
              >
                Address Line
              </label>
              <input
                id="addressLine"
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                onBlur={() => handleBlur('addressLine')}
                placeholder="123 Construction Hub, Nawala Road"
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.addressLine && errors.addressLine
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                }`}
              />
              {touched.addressLine && errors.addressLine && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.addressLine}</span>
                </p>
              )}
            </div>

            {/* City and District Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => handleBlur('city')}
                  placeholder="Nugegoda"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                    touched.city && errors.city
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                      : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                  }`}
                />
                {touched.city && errors.city && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5">
                  District
                </label>
                <DistrictSelector
                  value={district}
                  onChange={(selected) => {
                    setDistrict(selected);
                    setTouched((prev) => ({ ...prev, district: true }));
                  }}
                  error={touched.district ? errors.district : undefined}
                />
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 3: TAX AND STATUTORY DETAILS (ACCORDION) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-[#f8fafc]/60">
            <button
              type="button"
              onClick={() => setTaxSectionExpanded(!taxSectionExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Tax and Statutory Details
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  taxSectionExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {taxSectionExpanded && (
              <div className="p-4 pt-2 border-t border-slate-200 bg-white space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* VAT / TIN Number */}
                  <div>
                    <label
                      htmlFor="vatTin"
                      className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                    >
                      VAT / TIN Number
                    </label>
                    <input
                      id="vatTin"
                      type="text"
                      value={vatTinNumber}
                      onChange={(e) => setVatTinNumber(e.target.value)}
                      placeholder="123456789-8000"
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                    />
                  </div>

                  {/* EPF Employer No */}
                  <div>
                    <label
                      htmlFor="epfNo"
                      className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                    >
                      EPF Employer No
                    </label>
                    <input
                      id="epfNo"
                      type="text"
                      value={epfEmployerNo}
                      onChange={(e) => setEpfEmployerNo(e.target.value)}
                      placeholder="EPF/12345/A"
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* ETF Employer No */}
                  <div>
                    <label
                      htmlFor="etfNo"
                      className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                    >
                      ETF Employer No
                    </label>
                    <input
                      id="etfNo"
                      type="text"
                      value={etfEmployerNo}
                      onChange={(e) => setEtfEmployerNo(e.target.value)}
                      placeholder="ETF/67890/B"
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                    />
                  </div>

                  {/* VAT Registered? Container with Switch */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-transparent mb-1.5 select-none sm:block hidden">
                      &nbsp;
                    </label>
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        VAT Registered?
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsVatRegistered(!isVatRegistered)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                          isVatRegistered ? 'bg-futura-500' : 'bg-slate-300'
                        }`}
                        role="switch"
                        aria-checked={isVatRegistered}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                            isVatRegistered ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 4: PREFERENCES & ASSETS */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-800">
                Preferences & Assets
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Currency */}
              <div>
                <label
                  htmlFor="currency"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  Currency
                </label>
                <input
                  id="currency"
                  type="text"
                  value="LKR Rs. (Sri Lankan Rupee)"
                  readOnly
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Financial Year Start */}
              <div>
                <label
                  htmlFor="fyStart"
                  className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
                >
                  Financial Year Start
                </label>
                <div className="relative">
                  <select
                    id="fyStart"
                    value={financialYearStart}
                    onChange={(e) => setFinancialYearStart(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-900 appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 cursor-pointer"
                  >
                    <option value="1 April">1 April</option>
                    <option value="1 January">1 January</option>
                    <option value="1 July">1 July</option>
                    <option value="1 October">1 October</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Logo */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5">
                Company Logo
              </label>
              <LogoUploadZone
                logoBase64={logoBase64}
                logoFileName={logoFileName}
                onFileSelect={(base64, name) => {
                  setLogoBase64(base64);
                  setLogoFileName(name);
                }}
                onFileRemove={() => {
                  setLogoBase64(undefined);
                  setLogoFileName(undefined);
                }}
              />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* ACTION BUTTONS */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold text-sm sm:text-base tracking-wide shadow-md shadow-futura-500/20 transition duration-150 flex items-center justify-center cursor-pointer"
            >
              <span>Continue</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleBack}
                className="w-40 py-2.5 px-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium text-xs sm:text-sm transition text-center cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-blue-600 font-semibold hover:underline text-xs sm:text-sm cursor-pointer"
              >
                Save and finish later
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Draft Saved Modal */}
      <SaveDraftModal
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        savedTime={savedTimestamp}
      />

      {/* ── Centered Support Link below the card ── */}
      <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
        <span>Facing issues? Our onboarding specialists are here to help. </span>
        <button
          type="button"
          onClick={onOpenHelp}
          className="text-blue-600 font-semibold hover:underline cursor-pointer focus:outline-none"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

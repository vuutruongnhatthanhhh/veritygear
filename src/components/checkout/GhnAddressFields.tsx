"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Province = { ProvinceID: number; ProvinceName: string };
type District = { DistrictID: number; DistrictName: string };
type Ward = { WardCode: string; WardName: string };

type Selection = {
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
};

const selectCls =
  "h-13 w-full border border-ink/25 bg-transparent px-5 text-sm focus:border-ink focus:outline-none disabled:opacity-50";

export function GhnAddressFields({ onWardSelected }: { onWardSelected: (selection: Selection) => void }) {
  const t = useTranslations("checkout");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardCode, setWardCode] = useState("");

  useEffect(() => {
    fetch("/api/ghn/provinces")
      .then((res) => res.json())
      .then((data) => setProvinces(data.provinces ?? []))
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDistricts([]);
    setDistrictId("");
    setWards([]);
    setWardCode("");
    if (!provinceId) return;
    fetch(`/api/ghn/districts?province_id=${provinceId}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(() => setDistricts([]));
  }, [provinceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWards([]);
    setWardCode("");
    if (!districtId) return;
    fetch(`/api/ghn/wards?district_id=${districtId}`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards ?? []))
      .catch(() => setWards([]));
  }, [districtId]);

  function handleWardChange(code: string) {
    setWardCode(code);
    const province = provinces.find((p) => String(p.ProvinceID) === provinceId);
    const district = districts.find((d) => String(d.DistrictID) === districtId);
    const ward = wards.find((w) => w.WardCode === code);
    if (province && district && ward) {
      onWardSelected({
        provinceId: province.ProvinceID,
        provinceName: province.ProvinceName,
        districtId: district.DistrictID,
        districtName: district.DistrictName,
        wardCode: ward.WardCode,
        wardName: ward.WardName,
      });
    }
  }

  const selectedProvince = provinces.find((p) => String(p.ProvinceID) === provinceId);
  const selectedDistrict = districts.find((d) => String(d.DistrictID) === districtId);
  const selectedWard = wards.find((w) => w.WardCode === wardCode);

  return (
    <>
      <select
        required
        value={provinceId}
        onChange={(e) => setProvinceId(e.target.value)}
        className={`${selectCls} sm:col-span-2`}
      >
        <option value="" disabled>{t("provincePlaceholder")}</option>
        {provinces.map((p) => (
          <option key={p.ProvinceID} value={p.ProvinceID}>
            {p.ProvinceName}
          </option>
        ))}
      </select>

      <select
        required
        value={districtId}
        onChange={(e) => setDistrictId(e.target.value)}
        disabled={!provinceId}
        className={selectCls}
      >
        <option value="" disabled>{t("districtPlaceholder")}</option>
        {districts.map((d) => (
          <option key={d.DistrictID} value={d.DistrictID}>
            {d.DistrictName}
          </option>
        ))}
      </select>

      <select
        required
        value={wardCode}
        onChange={(e) => handleWardChange(e.target.value)}
        disabled={!districtId}
        className={selectCls}
      >
        <option value="" disabled>{t("wardPlaceholder")}</option>
        {wards.map((w) => (
          <option key={w.WardCode} value={w.WardCode}>
            {w.WardName}
          </option>
        ))}
      </select>

      <input type="hidden" name="to_province_id" value={selectedProvince?.ProvinceID ?? ""} readOnly />
      <input type="hidden" name="to_province_name" value={selectedProvince?.ProvinceName ?? ""} readOnly />
      <input type="hidden" name="to_district_id" value={selectedDistrict?.DistrictID ?? ""} readOnly />
      <input type="hidden" name="to_district_name" value={selectedDistrict?.DistrictName ?? ""} readOnly />
      <input type="hidden" name="to_ward_code" value={selectedWard?.WardCode ?? ""} readOnly />
      <input type="hidden" name="to_ward_name" value={selectedWard?.WardName ?? ""} readOnly />
    </>
  );
}

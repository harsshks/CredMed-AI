import time

def stub_npi_registry(npi: str):
    time.sleep(0.3)
    if npi.startswith("99") or len(npi) != 10:
        return {"valid": False, "details": "NPI not found/invalid"}
    if npi == "1234567899":
        return {"valid": True, "active": False, "details": "Provider Suspended"}
    return {"valid": True, "active": True, "details": "Active NPI record found"}

def stub_state_license_board(license_num: str):
    time.sleep(0.4)
    if license_num.lower().startswith("exp"):
        return {"valid": True, "status": "EXPIRED"}
    if len(license_num) < 5:
        return {"valid": False, "status": "NOT_FOUND"}
    return {"valid": True, "status": "ACTIVE"}

def stub_google_maps_geocode(address: str):
    time.sleep(0.2)
    if not address or len(address) < 10:
        return {"valid": False, "match_type": "NONE"}
    if "PO BOX" in address.upper():
        return {"valid": True, "match_type": "PO_BOX_WARNING"}
    return {"valid": True, "match_type": "ROOFTOP"}

def stub_sanctions_check(npi: str):
    time.sleep(0.1)
    if npi == "1111111111":
        return {"sanctioned": True, "reason": "Fraud"}
    return {"sanctioned": False}

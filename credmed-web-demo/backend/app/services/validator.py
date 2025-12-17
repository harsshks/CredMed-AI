from app.models.schemas import ProviderInput, ValidationReport, FieldCheck
from app.external_stubs import *
from datetime import datetime

class ValidatorService:
    def validate_provider(self, provider: ProviderInput) -> ValidationReport:
        checks = []
        audit_log = [f"Started validation for {provider.npi} at {datetime.now()}"]
        score = 100

        # NPI
        npi_res = stub_npi_registry(provider.npi)
        if not npi_res["valid"]:
            score -= 40
            checks.append(FieldCheck(field="npi", status="FAIL", message=npi_res["details"], source_stub="NPPES"))
        elif not npi_res.get("active", True):
            score -= 40
            checks.append(FieldCheck(field="npi", status="FAIL", message="NPI Inactive", source_stub="NPPES"))
        else:
            checks.append(FieldCheck(field="npi", status="PASS", message="Active", source_stub="NPPES"))

        # Sanctions
        sanc_res = stub_sanctions_check(provider.npi)
        if sanc_res["sanctioned"]:
            score = 0
            checks.append(FieldCheck(field="sanctions", status="FAIL", message=f"Sanctioned: {sanc_res['reason']}", source_stub="OIG"))
        else:
            checks.append(FieldCheck(field="sanctions", status="PASS", message="Clean", source_stub="OIG"))

        # License
        lic_res = stub_state_license_board(provider.license_number)
        if not lic_res["valid"]:
            score -= 30
            checks.append(FieldCheck(field="license", status="FAIL", message="Not Found", source_stub="STATE"))
        elif lic_res["status"] != "ACTIVE":
            score -= 20
            checks.append(FieldCheck(field="license", status="WARN", message=lic_res["status"], source_stub="STATE"))
        else:
            checks.append(FieldCheck(field="license", status="PASS", message="Active", source_stub="STATE"))

        # Address
        addr_res = stub_google_maps_geocode(provider.address)
        if not addr_res["valid"]:
            score -= 10
            checks.append(FieldCheck(field="address", status="FAIL", message="Invalid", source_stub="MAPS"))
        elif addr_res["match_type"] == "PO_BOX_WARNING":
            score -= 5
            checks.append(FieldCheck(field="address", status="WARN", message="PO Box Detected", source_stub="MAPS"))
        else:
            checks.append(FieldCheck(field="address", status="PASS", message="Verified", source_stub="MAPS"))

        final_score = max(0, score)
        risk = "HIGH" if final_score < 60 else "MEDIUM" if final_score < 85 else "LOW"
        audit_log.append(f"Completed. Score: {final_score}")

        return ValidationReport(
            provider_input=provider,
            confidence_score=final_score,
            risk_level=risk,
            field_checks=checks,
            audit_trail=audit_log
        )

param (
    [switch]$Count
)

# Load Toolkit
. ".build\MeasureManualTests.ps1"

if ($Count) {
    Count-ManualTests
}

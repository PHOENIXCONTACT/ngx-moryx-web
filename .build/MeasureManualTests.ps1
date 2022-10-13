function Count-ManualTests([string]$SearchRootPath = "", [string]$ManualTestPath = "docs\manualTests", [string]$IndexFileName = "0_index.md", 
[string]$OutputFilePath = "") {

    if (!$SearchRootPath) {
        $path = Split-Path -Path $PSScriptRoot -Parent
    }
    else {
        $path = $SearchRootPath
    }

    # Find file in which all manual test results are documented
    if(!$OutputFilePath){
        $outputPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop) + "\ManualTestsEvaluation.txt";
    }
    else{
        $outputPath = $OutputFilePath;
    }
    $outputPathExists = Test-Path -Path $outputPath
    if(!$outputPathExists){
        Write-Host("Output File " + $outputPath + " doesn't exist. So it will be created.")
        New-Item $outputPath -ItemType file
    }
    
    # Find folder of manual tests
    $path = $path + "\" + $ManualTestPath
    Write-Host("Checking for manual tests in " + $path)
    Write-Host("")
    $testFolders = Get-ChildItem -Path $path -Recurse -Directory 

    foreach ($folder in $testFolders) {
        Write-Host("Get the number of manual tests for the module " + $folder)

        Delete-Former-Test-Results $outputPath $folder;

        Write-Host("Add new test results")
        $directoryPath = $path + "\" + $folder
        $testFiles = Get-ChildItem -Path $directoryPath -Recurse -Exclude $IndexFileName
        $measureObject = $testFiles | Measure-Object
        $numberOfFiles = $measureObject.Count 
        $message = "Module " + $folder + ": " + $numberOfFiles + " Tests"
        Write-Host("   " + $message)
        Add-Content -Path $outputPath -Value $message
        foreach ($testfile in $testFiles) {
            $filePath = $directoryPath + "\" + $testfile.Name
            $numberOfLines = Get-Content -Path $filePath | Measure-Object -Line
            $message = "   " + $testfile.Name + ": " + $numberOfLines.Lines + " Lines"
            Write-Host("   " + $message)
            Add-Content -Path $outputPath -Value $message
        }
        Write-Host("")
    }
    Write-Host("Found all tests")
}

function Delete-Former-Test-Results([string]$FilePath,[string]$ModuleName){
    Write-Host('Remove former test results')
    $content = Get-Content -path $FilePath;
    
    # regex for when the text is in the middle of the file
    $regex = '(Module ' + $ModuleName + ': (\s|\S)*Module )'
    # search for former test results
    $remove = [regex]::Match($content,$regex,[System.Text.RegularExpressions.RegexOptions]::Singleline).Groups[0].Value;
    if ([string]::IsNullOrEmpty($remove)){
        # regex for when the text is at the end of file
        $regex = '(Module ' + $ModuleName + ': (\s|\S)*)'
        $remove = [regex]::Match($content,$regex,[System.Text.RegularExpressions.RegexOptions]::Singleline).Groups[0].Value;
        if([string]::IsNullOrEmpty($remove)){
            Write-Host('   No former test results found')
            return;
        } 
    }

    # going through all the lines of the file and remove the former test results
    $found = $false;
    Remove-Item $FilePath
    New-Item $FilePath -ItemType file
    foreach($line in $content) {
        if($found -eq $false -And $line.contains('Module ' + $ModuleName + ': ')){
            $found = $true;
        }
        if($found -eq $false){
            Add-Content -Path $FilePath -Value $line
            continue;
        }

        if($remove.contains($line)){
            Write-Host('   Remove Line: ' + $line);
            continue;
        }else{
            $found = $false;
             Add-Content -Path $FilePath -Value $line
        }
    }
}

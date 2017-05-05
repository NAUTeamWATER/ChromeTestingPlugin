//=================================================== Selenium (Java) File ===========================================================

/**
 * Function to take sorted element object array, parse through, and create a Selenium compatible .java file and download it.
 *
 * Note: Currently commented out code is for general use (i.e. non-Choice Hotels specific).
 * For Choice version, make sure anything involving webElement, driver, WebDriver, etc. is commented out.
 * For Consumer version make sure anything involving pagedriver or page is commented out.
 */
function createSeleniumFile(outputFileHeader, elementObjects) {

    // Create output string
    let fileString = '';
    fileString += '/*Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '*/';

	// Helper function for encapsulating xPath in string notation
	function Xpathcleanup(elementObject,string){
		string += elementObject.xpath;
		string = string.replace('"', "'");
		string = string.replace('"', "'");
		return string;
	}

	// Add testing functionality to webElement
	function SetupFunctions(fileString, elementObject) {

	    // String to hold data
	    let XpathString = '';
		XpathString = Xpathcleanup(elementObject,XpathString);

		// Clickable elements (Button, on-click, ng-click)
		if (elementObject.type === 'Button' || elementObject.type === 'JavaScript (on-click)' || elementObject.type === 'Angular (ng-click)'){

		    // Click by name
		    if (elementObject.name !== null){
				fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;
				fileString += '        page.clickElementByName("' + elementObject.name  + '");\n' ;
				/*
				fileString += '        WebElement webElement = driver.findElement(By.name("'+ elementObject.name  + '"));\n';
				fileString += '        JavascriptExecutor js = (JavascriptExecutor)driver;\n' ;
				fileString += '        js.executeScript("arguments[0].click();", webElement);\n' ;
				*/
				fileString += '   }\n';
			}

			// Click by ID
			else if(elementObject.id !== null){
				fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;	
				fileString += '        page.clickElementById("' + elementObject.id  + '");\n' ;
				/*
				fileString += '        WebElement webElement = driver.findElement(By.id("' + elementObject.id  + '"));\n';
				fileString += '        JavascriptExecutor js = (JavascriptExecutor)driver;\n' ;
				fileString += '        js.executeScript("arguments[0].click();", webElement);\n' ;
				*/
				fileString += '   }\n';
			}

			// Click by XPath
			else {
			    fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;	
				fileString += '        page.clickElementByXpath("' + XpathString  + '");\n' ;
				/*
				fileString += '        WebElement webElement = driver.findElement(By.xpath("' + elementObject.xpath  + '"));\n';
				fileString += '        JavascriptExecutor js = (JavascriptExecutor)driver;\n' ;
				fileString += '        js.executeScript("arguments[0].click();", webElement);\n' ;
				*/
				fileString += '   }\n';
			}

		}

		// Clickable Links (separate due to web element code)
		else if(elementObject.type === 'Link'){

		    // Click by name
			if (elementObject.name !== null){
				fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;
				fileString += '        page.clickElementByName("' + elementObject.name  + '");\n' ;
				/*
				fileString += '        WebElement webElement = driver.findElement(By.name("'+ elementObject.name  + '"));\n';
				fileString += '        webElement.click();\n' ;
				*/
			    fileString += '   }\n';
			}

			// Click by ID
			else if(elementObject.id !== null){
				fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;
				fileString += '        page.clickElementById("' + elementObject.id  + '");\n' ;
				/*
				fileString += '        WebElement webElement = driver.findElement(By.id("' + elementObject.id  + '"));\n';
				fileString += '        webElement.click();\n' ;
				*/
			    fileString += '   }\n';
			}

			// Click by XPath
			else {
				fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;
				fileString += '        page.clickElementByXpath("' + XpathString  + '");\n' ;
				/*
				fileString += '        WebElement webElement = driver.findElement(By.xpath("' + elementObject.xpath  + '"));\n';
				fileString += '        webElement.click();\n' ;
			    */
				fileString += '   }\n';
			}
		}

		// Inputs (Get and Set)
		else if(elementObject.type === 'Input'){

		    // Reference by name
			if (elementObject.name !== null){
			    // Getter function
				fileString += '   public String get'+elementObject.descriptiveName + '(){\n' ;	
				fileString += '         page.getFieldValueByName("' + elementObject.name  + '");\n' ;
				/*
				fileString += '			WebElement webElement = driver.findElement(By.name("'+ elementObject.name  + '"));\n';
				fileString += '         return webElement.getAttribute("value");\n';
				*/
				fileString += '   }\n';
				
			    // Setter function
				fileString += '   public void set'+elementObject.descriptiveName + '(String value){\n' ;
				fileString += '         page.typeValueInFieldByName("' + elementObject.name  + '" , value);\n' ;
				/*
				fileString += '         WebElement webElement = driver.findElement(By.name("' + elementObject.name  + '"));\n';
				fileString += '         webElement.clear();\n' ;
				fileString += '         webElement.sendKeys(value);\n' ;
				*/
				fileString += '   }\n';
			}

			// Reference by ID
			else if(elementObject.id !== null){
			    // Getter function
				fileString += '   public String get'+elementObject.descriptiveName + '(){\n' ;	
				fileString += '         page.getFieldValueById("' + elementObject.id  + '");\n' ;
				/*
				fileString += '         WebElement webElement = driver.findElement(By.id("' + elementObject.id  + '"));\n';
				fileString += '         return webElement.getAttribute("value");\n';
				*/
				fileString += '   }\n';
				
			    // Setter function
				fileString += '   public void set'+elementObject.descriptiveName + '(String value){\n' ;
				fileString += '         page.typeValueInFieldById("' + elementObject.id  + '" , value);\n' ;
				/*
				fileString += '         WebElement webElement = driver.findElement(By.id("' + elementObject.id  + '"));\n';
				fileString += '         webElement.clear();\n' ;
				fileString += '         webElement.sendKeys(value);\n' ;
				*/
				fileString += '   }\n';
			}

			// Reference by XPath
			else {
			    // Getter function
				fileString += '   public String get'+elementObject.descriptiveName + '(){\n' ;
				fileString += '         page.getFieldValueByXpath("' + XpathString  + '");\n' ;
				/*
				fileString += '         WebElement webElement = driver.findElement(By.xpath("' + elementObject.xpath  + '"));\n';
				fileString += '         return webElement.getAttribute("value");\n';
				*/
				fileString += '   }\n';
				
			    // Setter function
				fileString += '   public void set'+elementObject.descriptiveName + '(String value){\n' ;
				fileString += '         page.typeValueInFieldByXpath("' + XpathString  + '" , value);\n' ;
				/*
				fileString += '         WebElement webElement = driver.findElement(By.xpath("' + elementObject.xpath  + '"));\n';
				fileString += '         webElement.clear();\n' ;
				fileString += '         webElement.sendKeys(value);\n' ;
				*/
				fileString += '   }\n';
			}

		}

		// Unknown element, return
		else {
			return fileString;
		}

		// Return final string
		return fileString;
    }


    // Start actual file output here
	fileString += '\n';
	fileString += 'import org.openqa.selenium.*;';
	fileString += '\n\n';
	fileString += 'public class SampleTestClass { \n\n';
	
	fileString += '   public PageDriver page;\n\n';
	fileString += '   public SampleTestClass(PageDriver page) {\n';
	fileString += '			this.page = page;\n';
	fileString += '	  }\n';
	//fileString += '   private WebDriver driver = new ChromeDriver();';

    // Populate with data
    for (let i = 0; i < elementObjects.length; i++){
		if (elementObjects[i].hasDescriptiveName == true){
			fileString += '/*\n' +elementObjects[i].descriptiveName + '\n*/\n';
		}
		else{
			fileString += '/*\n' +elementObjects[i].fullHTML + '\n*/\n';
		}
		fileString = SetupFunctions(fileString, elementObjects[i]);
		fileString += '\n\n';
    }

    // Finish strong
	fileString += '}';

    // Create blob for output format
    const blob = new Blob([fileString], {
        type: 'text/plain'
    });

    // Return URL to download
    return URL.createObjectURL(blob);

}
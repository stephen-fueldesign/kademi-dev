import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('http://rootorg.admin.kademi-ci.co/')

WebUI.maximizeWindow()

WebUI.setText(findTestObject('Kademi-vladtest22/input_email'), GlobalVariable.bigadmin)

WebUI.setText(findTestObject('Kademi-vladtest22/input_password'), GlobalVariable.bigadminpass)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Organisations'))

WebUI.click(findTestObject('Kademi-vladtest22/button_Tools'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Create account'))

WebUI.focus(findTestObject('Kademi-vladtest22/div_modal-create-account'))

WebUI.click(findTestObject('Kademi-vladtest22/input_title'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_title'), GlobalVariable.orgname)

WebUI.click(findTestObject('Kademi-vladtest22/input_orgId'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_orgId'), GlobalVariable.orgname)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create'))

WebUI.delay(15, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Add new user'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('kademi-vladtest/div_modal-new-user'))

WebUI.click(findTestObject('Kademi-vladtest22/input_nickName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_nickName'), GlobalVariable.admin.split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_firstName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_firstName'), GlobalVariable.admin.split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_surName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_surName'), GlobalVariable.admin.split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_email (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email (1)'), GlobalVariable.admin)

WebUI.click(findTestObject('Kademi-vladtest22/select_group'))

WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'administrator', true)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create and view'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/a_Profile'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/input_password (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password (1)'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Kademi-vladtest22/input_confirmPassword'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_confirmPassword'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Email-job-case/Page_Manage users/button_Save-user_edit_page'))

WebUI.click(findTestObject('Kademi-vladtest22/span_adminqa'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Log Out'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email'), GlobalVariable.admin)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Kademi-vladtest22/button_Log in'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Website Manager'))

WebUI.click(findTestObject('kademi-vladtest/span_Websites'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (3)'))

WebUI.focus(findTestObject('kademi-vladtest/div_                        Ad'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_newName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName'), WebUI.concatenate((([GlobalVariable.orgname, 'web']) as String[])))

WebUI.click(findTestObject('kademi-vladtest/button_Create website'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KLearning'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/span_E-Learning'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/span_Courses'))

WebUI.click(findTestObject('kademi-vladtest/b_Program'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (4)'))

WebUI.delay(1)

WebUI.focus(findTestObject('kademi-vladtest/div_                        Pr'))

WebUI.click(findTestObject('kademi-vladtest/input_programName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_programName'), 'Program1')

WebUI.click(findTestObject('kademi-vladtest/input_programTitle'))

WebUI.setText(findTestObject('kademi-vladtest/input_programTitle'), 'Program1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New course'))

WebUI.delay(5)

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/input_courseName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseName'), 'Course1')

WebUI.click(findTestObject('kademi-vladtest/input_courseTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseTitle'), 'Course1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (1)'))

WebUI.delay(3)

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.delay(1)

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module1')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module2')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module2Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module3')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module3Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KBlogs'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/a_Back to website manager - correct'))

WebUI.click(findTestObject('kademi-vladtest/Details-tab-for-website-properties'))

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KRewardStore'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(20)

WebUI.click(findTestObject('kademi-vladtest/a_Back to website manager - correct'))

WebUI.click(findTestObject('kademi-vladtest/Details-tab-for-website-properties'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KAuctions'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KSalesData'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/a_Back to website manager - correct'))

WebUI.click(findTestObject('kademi-vladtest/Details-tab-for-website-properties'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_salesDataClaimer'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KCalendar'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/a_Back to website manager - correct'))

WebUI.click(findTestObject('kademi-vladtest/Details-tab-for-website-properties'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_ksurveyapp'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KOrgsLocator'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KPromotions'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KSignup'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_kpollapp'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KReporting'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KJourneys'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KContactus'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))


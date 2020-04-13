require "application_system_test_case"


class RetrobotSystemTestCase < ApplicationSystemTestCase
  def teardown
    errors = page.driver.browser.manage.logs.get(:browser)
    error_msg_array = errors.map(&:message).select { |m|
      !m.include? 'favicon' and !m.include? '401' and !m.include? 'react-unsafe-component-lifecycles'
    }
    if error_msg_array.present?
      puts error_msg_array.join("\n")
    end
    assert !error_msg_array.present?
  end

  def input_with_emoji(element, text)
    page.execute_script("var elm = arguments[0]; var txt = arguments[1]; elm.value += txt; elm.dispatchEvent(new Event('change'));", element, text)
  end
end

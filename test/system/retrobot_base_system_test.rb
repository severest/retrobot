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
end

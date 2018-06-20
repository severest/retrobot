require "application_system_test_case"


class RetrobotSystemTestCase < ApplicationSystemTestCase
  def teardown
    errors = page.driver.browser.manage.logs.get(:browser)
    error_msg_array = errors.map(&:message).select { |m| !m.include? 'favicon' and !m.include? '401' }
    if error_msg_array.present?
      puts error_msg_array.join("\n")
    end
    assert !error_msg_array.present?
  end

  def visit(url)
    if !ENV['LOCAL_TESTING'].nil?
      super 'http://localhost:8080' + url
    else
      super url
    end
  end
end

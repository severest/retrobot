require "application_system_test_case"


class RetrobotSystemTestCase < ApplicationSystemTestCase
  def teardown
    errors = page.driver.browser.manage.logs.get(:browser)
    if errors.present?
      message = errors.map(&:message).join("\n")
      puts message
    end
    assert !errors.present?
  end

  def visit(url)
    if !ENV['LOCAL_TESTING'].nil?
      super 'http://localhost:8080' + url
    else
      super url
    end
  end
end

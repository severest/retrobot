require "application_system_test_case"


class RetrobotSystemTestCase < ApplicationSystemTestCase
  def input_with_emoji(element, text)
    page.execute_script("var elm = arguments[0]; var txt = arguments[1]; elm.value += txt; elm.dispatchEvent(new Event('change'));", element, text)
  end
end

require "test_helper"
require "percy"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  if !ENV['HEADLESS'].nil?
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  else
    driven_by :selenium_chrome_headless
  end
end

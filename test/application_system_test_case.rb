require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  if !ENV['LOCAL_TESTING'].nil?
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
    Capybara.server_port = 3000
  else
    driven_by :headless_chrome
  end
end

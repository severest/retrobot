require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  if !ENV['LOCAL_TESTING'].nil?
    Capybara.server_port = 3000
  end
end

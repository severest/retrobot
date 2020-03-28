require 'test_helper'

class TemperatureCheckTest < ActiveSupport::TestCase
  test "create only floating between 0 and 10" do
    temperature_check = create(:temperature_check)
    temperature_check.temperature = -1
    assert !temperature_check.valid?
    temperature_check.temperature = -0.3
    assert !temperature_check.valid?
    temperature_check.temperature = 0.3
    assert temperature_check.valid?
    temperature_check.temperature = 3.5
    assert temperature_check.valid?
    temperature_check.temperature = 16
    assert !temperature_check.valid?
    temperature_check.temperature = 10.2
    assert !temperature_check.valid?
    temperature_check.temperature = 10
    assert temperature_check.valid?
    temperature_check.temperature = 0
    assert temperature_check.valid?
    temperature_check.temperature = 7
    assert temperature_check.valid?
  end
end

require 'test_helper'

class DeltaTest < ActiveSupport::TestCase
  test "create a delta" do
    assert_difference 'Delta.count', 1 do
      Delta.create(retro: retros(:one), content: 'delta content', user: 'jojoj')
    end
  end

  test "cant create a delta without a retro" do
    assert_no_difference 'Delta.count' do
      Delta.create(content: 'delta content', user: 'jojoj')
    end
  end
end

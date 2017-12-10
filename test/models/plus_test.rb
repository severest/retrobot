require 'test_helper'

class PlusTest < ActiveSupport::TestCase
  test "create a plus" do
    assert_difference 'Plus.count', 1 do
      Plus.create(retro: retros(:one), content: 'plus content', user: 'jojoj')
    end
  end

  test "cant create a plus without a retro" do
    assert_no_difference 'Plus.count' do
      Plus.create(content: 'plus content', user: 'jojoj')
    end
  end
end

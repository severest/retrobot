require 'test_helper'

class RetroTest < ActiveSupport::TestCase
  test "create a retro" do
    assert_difference 'Retro.count', 1 do
      Retro.create(key: '123456')
    end
  end

  test "create a retro with a short key" do
    assert_no_difference 'Retro.count' do
      Retro.create(key: '123')
    end
  end

  test "create a retro with a long key" do
    assert_no_difference 'Retro.count' do
      Retro.create(key: '1234567899')
    end
  end

  test "create a retro with special characters" do
    assert_no_difference 'Retro.count' do
      Retro.create(key: '123?56')
    end
  end
end

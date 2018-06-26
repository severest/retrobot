require 'test_helper'

class DeltaGroupItemTest < ActiveSupport::TestCase
  test "removes item when delta deleted" do
    retro = create(:retro, key: 'eeeee2')
    delta = create(:delta, retro: retro)
    delta_group = create(:delta_group, retro: retro)
    item = create(:delta_group_item, delta_group: delta_group, delta: delta)
    assert_equal DeltaGroupItem.count, 1
    delta.destroy
    assert_equal DeltaGroupItem.count, 0
  end

  test "delta cannot be a part of two groups" do
    assert_raises ActiveRecord::RecordNotUnique do
      retro = create(:retro, key: 'eeeee2')
      delta = create(:delta, retro: retro)
      delta_group1 = create(:delta_group, retro: retro)
      delta_group2 = create(:delta_group, retro: retro)
      item1 = create(:delta_group_item, delta_group: delta_group1, delta: delta)
      item2 = create(:delta_group_item, delta_group: delta_group2, delta: delta)
    end
  end
end

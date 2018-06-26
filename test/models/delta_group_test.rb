require 'test_helper'

class DeltaGroupTest < ActiveSupport::TestCase
  test "add deltas" do
    retro = create(:retro, key: 'eeeee2')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    delta_group = create(:delta_group, retro: retro)
    delta_group.add_deltas([delta1.id, delta2.id])
    assert_equal delta_group.deltas.count, 2
  end
end

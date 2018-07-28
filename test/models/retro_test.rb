require 'test_helper'

class RetroTest < ActiveSupport::TestCase
  test "create a retro" do
    assert_difference 'Retro.count', 1 do
      Retro.create(key: '123456')
    end
  end

  test "create a retro with team" do
    assert_difference 'Retro.count', 1 do
      t = teams(:one)
      r = Retro.create(key: '123456', team: t)
      assert_equal r.team.name, t.name
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

  test "prune old retros" do
    assert_difference 'Retro.count', -1 do
      Retro.prune_old_retros
    end
  end

  test "print delta groups" do
    retro = create(:retro, key: 'eeeee2')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    delta3 = create(:delta, retro: retro)
    delta_group1 = create(:delta_group, retro: retro)
    delta_group1.add_deltas([delta1.id, delta2.id])
    delta_group2 = create(:delta_group, retro: retro)
    delta_group2.add_deltas([delta3.id])

    expected = [
      {'id' => delta_group1.id, 'deltas' => [delta1.id, delta2.id]},
      {'id' => delta_group2.id, 'deltas' => [delta3.id]},
    ]
    assert_equal retro.delta_group_array, expected
  end
end

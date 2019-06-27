require 'test_helper'

class WebsocketTest < ActiveSupport::TestCase
  test "create a note" do
    retro = create(:retro, key: 'eeeee2')
    group = create(:delta_group_one_delta, retro: retro)
    data = {
      'type' => 'notes',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'notes' => 'test note'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    group.reload
    assert_equal group.notes, 'test note'
    callback.verify
    notification_callback.verify
  end

  test "lock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'lock',
      'userId' => 'user1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'locked'}]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'locked'
    callback.verify
    notification_callback.verify
  end

  test "lock retro with empty creator" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'lock',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'locked'}]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'locked'
    callback.verify
    notification_callback.verify
  end

  test "non-creator shouldnt lock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'lock',
      'userId' => 'notuser1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
    notification_callback.verify
  end

  test "empty user shouldnt lock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'lock',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
    notification_callback.verify
  end

  test "unlock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'unlock',
      'userId' => 'user1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'voting'}]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'voting'
    callback.verify
    notification_callback.verify
  end

  test "unlock retro with empty creator" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'unlock',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'voting'}]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'voting'
    callback.verify
    notification_callback.verify
  end

  test "shouldnt unlock retro with wrong creator" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'unlock',
      'userId' => 'notuser1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
    notification_callback.verify
  end

  test "shouldnt unlock retro with empty creator" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'unlock',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
    notification_callback.verify
  end

  test "pass the time through" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    assert_equal retro.status, 'in_progress'
    data = {
      'type' => 'time',
      'minutes' => '3',
      'seconds' => '2',
      'userId' => 'user1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
    notification_callback.verify
  end

  test "shouldnt pass the time through with wrong user" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    assert_equal retro.status, 'in_progress'
    data = {
      'type' => 'time',
      'minutes' => '3',
      'seconds' => '2',
      'userId' => 'notuser1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
    notification_callback.verify
  end

  test "progress the retro when time runs out" do
    retro = create(:retro, key: 'eeeee2')
    assert_equal retro.status, 'in_progress'
    data = {
      'type' => 'time',
      'minutes' => 0,
      'seconds' => 0
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'voting'}]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    retro.reload
    assert_equal retro.status, 'voting'
    callback.verify
    notification_callback.verify
  end

  test "pass the noteslock through" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'noteslock'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    callback.verify
    notification_callback.verify
  end

  test "pass the notesunlock through" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'notesunlock'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    callback.verify
    notification_callback.verify
  end

  test "should not pass garbage through" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'jojos'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    callback.verify
    notification_callback.verify
  end

  test "should create delta" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'delta',
      'content' => 'a new delta',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('Delta.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not create delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    data = {
      'type' => 'delta',
      'content' => 'a new delta',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('Delta.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should create plus" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'plus',
      'content' => 'a new plus',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('Plus.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not create plus when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    data = {
      'type' => 'plus',
      'content' => 'a new plus',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('Plus.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should delete delta" do
    retro = create(:retro, key: 'eeeee2')
    group = create(:delta_group_one_delta, retro: retro)
    data = {
      'type' => 'delete',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    callback.expect :call, nil, [{
      'type' => 'deltaGroups',
      'groups' => [],
    }]
    assert_difference('Delta.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not delete delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    group = create(:delta_group_one_delta, retro: retro)
    data = {
      'type' => 'delete',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('Delta.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should delete plus" do
    retro = create(:retro, key: 'eeeee2')
    plus = create(:plus, retro: retro)
    data = {
      'type' => 'delete',
      'itemType' => 'plus',
      'itemId' => plus.id,
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('Plus.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not delete plus when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    plus = create(:plus, retro: retro)
    data = {
      'type' => 'delete',
      'itemType' => 'plus',
      'itemId' => plus.id,
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('Plus.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should upvote delta" do
    retro = create(:retro, key: 'eeeee2')
    group = create(:delta_group_one_delta, retro: retro)
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaGroupVote.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not allow more upvotes than max" do
    retro = create(:retro, key: 'eeeee2', max_votes: 1)
    group = create(:delta_group_one_delta, retro: retro)
    delta_vote = create(:delta_vote, delta_group: group, user: '1')
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    notification_callback.expect :call, nil, [{"error"=>"You've already voted the maximum number of times"}]
    assert_no_difference('DeltaGroupVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not allow more upvotes than max on diff deltas" do
    retro = create(:retro, key: 'eeeee2', max_votes: 2)
    group = create(:delta_group_one_delta, retro: retro)
    group2 = create(:delta_group_one_delta, retro: retro)
    vote = create(:delta_vote, delta_group: group, user: '1')
    vote2 = create(:delta_vote, delta_group: group2, user: '1')
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    notification_callback.expect :call, nil, [{"error"=>"You've already voted the maximum number of times"}]
    assert_no_difference('DeltaGroupVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should allow more upvotes than max on diff retros" do
    retro = create(:retro, key: 'eeeee2', max_votes: 2)
    retro2 = create(:retro, key: 'eeeee3', max_votes: 2)
    group = create(:delta_group_one_delta, retro: retro)
    group2 = create(:delta_group_one_delta, retro: retro2)
    vote = create(:delta_group_vote, delta_group: group, user: '1')
    vote2 = create(:delta_group_vote, delta_group: group2, user: '1')
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaGroupVote.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should allow more upvotes than max on diff deltas with diff people" do
    retro = create(:retro, key: 'eeeee2', max_votes: 2)
    group = create(:delta_group_one_delta, retro: retro)
    group2 = create(:delta_group_one_delta, retro: retro)
    vote = create(:delta_group_vote, delta_group: group, user: '1')
    vote2 = create(:delta_group_vote, delta_group: group2, user: '2')
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaGroupVote.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should allow more upvotes than max from a diff user" do
    retro = create(:retro, key: 'eeeee2', max_votes: 1)
    group = create(:delta_group_one_delta, retro: retro)
    vote = create(:delta_group_vote, delta_group: group, user: '1')
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '2',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaGroupVote.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not upvote delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    group = create(:delta_group_one_delta, retro: retro)
    data = {
      'type' => 'upvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('DeltaGroupVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should downvote delta" do
    retro = create(:retro, key: 'eeeee2')
    group = create(:delta_group_one_delta, retro: retro)
    delta_vote = create(:delta_group_vote, delta_group: group, user: '1')
    data = {
      'type' => 'downvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaGroupVote.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not downvote delta if vote doesnt exist" do
    retro = create(:retro, key: 'eeeee2')
    group = create(:delta_group_one_delta, retro: retro)
    delta_vote = create(:delta_group_vote, delta_group: delta, user: '2')
    data = {
      'type' => 'downvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    notification_callback.expect :call, nil, [{"error"=>"You can't downvote something you haven't voted for"}]
    assert_no_difference('DeltaGroupVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not downvote delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    group = create(:delta_group_one_delta, retro: retro)
    delta_vote = create(:delta_group_vote, delta_group: group, user: '1')
    data = {
      'type' => 'downvote',
      'itemType' => 'deltaGroup',
      'itemId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('DeltaGroupVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should create delta group" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    data = {
      'type' => 'group',
      'itemType' => 'delta',
      'deltas' => [delta1.id, delta2.id],
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [Object]
    assert_difference('DeltaGroup.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    assert_equal DeltaGroup.first().deltas.map { |d| d.id }, [delta1.id, delta2.id]
    callback.verify
    notification_callback.verify
  end

  test "should not create delta group when not creator" do
    retro = create(:retro, key: 'eeeee2', creator: '2')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    data = {
      'type' => 'group',
      'itemType' => 'delta',
      'deltas' => [delta1.id, delta2.id],
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('DeltaGroup.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should delete delta group" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    group = create(:delta_group, retro: retro)
    group.add_deltas([delta1.id, delta2.id])
    data = {
      'type' => 'delete',
      'itemType' => 'deltaGroup',
      'deltaGroupId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [Object]
    assert_difference('DeltaGroup.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should not delete delta group when not creator" do
    retro = create(:retro, key: 'eeeee2', creator: '2')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    group = create(:delta_group, retro: retro)
    group.add_deltas([delta1.id, delta2.id])
    data = {
      'type' => 'delete',
      'itemType' => 'deltaGroup',
      'deltaGroupId' => group.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    assert_no_difference('DeltaGroup.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end

  test "should delete previous groups when create delta group" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    delta3 = create(:delta, retro: retro)
    delta_group = create(:delta_group, retro: retro)
    delta_group.add_deltas([delta1.id, delta2.id])
    assert_equal DeltaGroup.first().deltas.map { |d| d.id }, [delta1.id, delta2.id]
    data = {
      'type' => 'group',
      'itemType' => 'delta',
      'deltas' => [delta1.id, delta2.id, delta3.id],
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [Object]
    assert_no_difference('DeltaGroup.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    assert_equal DeltaGroup.first().deltas.map { |d| d.id }, [delta1.id, delta2.id, delta3.id]
    callback.verify
    notification_callback.verify
  end

  test "should delete delta groups item" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    delta3 = create(:delta, retro: retro)
    delta_group = create(:delta_group, retro: retro)
    delta_group.add_deltas([delta1.id, delta2.id, delta3.id])
    assert_equal DeltaGroup.first().deltas.map { |d| d.id }, [delta1.id, delta2.id, delta3.id]
    data = {
      'type' => 'delete',
      'itemType' => 'deltaGroupItem',
      'deltaId' => delta1.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [Object]
    assert_difference('DeltaGroup.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    assert_equal DeltaGroup.first().deltas.map { |d| d.id }, [delta2.id, delta3.id]
    assert_equal DeltaGroup.last().deltas.map { |d| d.id }, [delta1.id]
    callback.verify
    notification_callback.verify
  end

  test "should add temperature check" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    data = {
      'type' => 'temperature',
      'userId' => '10',
      'temperature' => 3,
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [Object]
    assert_difference('TemperatureCheck.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    assert TemperatureCheck.where(retro: retro, user: '10').exists?
    callback.verify
    notification_callback.verify
  end

  test "should update temperature check" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    check = create(:temperature_check, retro: retro, user: '10', temperature: 3)
    data = {
      'type' => 'temperature',
      'userId' => '10',
      'temperature' => 8,
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    callback.expect :call, nil, [Object]
    assert_no_difference('TemperatureCheck.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    assert_equal TemperatureCheck.where(retro: retro, user: '10').first.temperature, 8
    callback.verify
    notification_callback.verify
  end

  test "should not create temperature check without temp" do
    retro = create(:retro, key: 'eeeee2', creator: '1')
    data = {
      'type' => 'temperature',
      'userId' => '10',
    }
    callback = MiniTest::Mock.new
    notification_callback = MiniTest::Mock.new
    notification_callback.expect :call, nil, [{"error"=>"Unable to create new temperature check"}]
    assert_no_difference('TemperatureCheck.count') do
      WebsocketHelper.handle('eeeee2', data, callback, notification_callback)
    end
    callback.verify
    notification_callback.verify
  end
end

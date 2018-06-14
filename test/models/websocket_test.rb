require 'test_helper'

class WebsocketTest < ActiveSupport::TestCase
  test "create a note" do
    retro = create(:retro, key: 'eeeee2')
    delta = create(:delta, retro: retro, content: 'hi')
    data = {
      'type' => 'notes',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'notes' => 'test note'
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback)
    delta.reload
    assert_equal delta.notes, 'test note'
    callback.verify
  end

  test "lock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'lock',
      'userId' => 'user1',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'locked'}]
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'locked'
    callback.verify
  end

  test "lock retro with empty creator" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'lock',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'locked'}]
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'locked'
    callback.verify
  end

  test "non-creator shouldnt lock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'lock',
      'userId' => 'notuser1',
    }
    callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
  end

  test "empty user shouldnt lock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'lock',
    }
    callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
  end

  test "unlock retro" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'unlock',
      'userId' => 'user1',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'voting'}]
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'voting'
    callback.verify
  end

  test "unlock retro with empty creator" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'unlock',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'voting'}]
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'voting'
    callback.verify
  end

  test "shouldnt unlock retro with wrong creator" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'unlock',
      'userId' => 'notuser1',
    }
    callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
  end

  test "shouldnt unlock retro with empty creator" do
    retro = create(:retro, key: 'eeeee2', creator: 'user1')
    data = {
      'type' => 'unlock',
    }
    callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
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
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
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
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'in_progress'
    callback.verify
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
    callback.expect :call, nil, [data]
    callback.expect :call, nil, [{'type' => 'status', 'status' => 'voting'}]
    WebsocketHelper.handle('eeeee2', data, callback)
    retro.reload
    assert_equal retro.status, 'voting'
    callback.verify
  end

  test "pass the noteslock through" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'noteslock'
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback)
    callback.verify
  end

  test "pass the notesunlock through" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'notesunlock'
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    WebsocketHelper.handle('eeeee2', data, callback)
    callback.verify
  end

  test "should not pass garbage through" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'jojos'
    }
    callback = MiniTest::Mock.new
    WebsocketHelper.handle('eeeee2', data, callback)
    callback.verify
  end

  test "should create delta" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'delta',
      'content' => 'a new delta',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('Delta.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not create delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    data = {
      'type' => 'delta',
      'content' => 'a new delta',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    assert_no_difference('Delta.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should create plus" do
    retro = create(:retro, key: 'eeeee2')
    data = {
      'type' => 'plus',
      'content' => 'a new plus',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('Plus.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not create plus when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    data = {
      'type' => 'plus',
      'content' => 'a new plus',
      'userId' => 'user1'
    }
    callback = MiniTest::Mock.new
    assert_no_difference('Plus.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should delete delta" do
    retro = create(:retro, key: 'eeeee2')
    delta = create(:delta, retro: retro)
    data = {
      'type' => 'delete',
      'itemType' => 'delta',
      'itemId' => delta.id,
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('Delta.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not delete delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    delta = create(:delta, retro: retro)
    data = {
      'type' => 'delete',
      'itemType' => 'delta',
      'itemId' => delta.id,
    }
    callback = MiniTest::Mock.new
    assert_no_difference('Delta.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
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
    callback.expect :call, nil, [data]
    assert_difference('Plus.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
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
    assert_no_difference('Plus.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should upvote delta" do
    retro = create(:retro, key: 'eeeee2')
    delta = create(:delta, retro: retro)
    data = {
      'type' => 'upvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaVote.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not allow more upvotes than max" do
    retro = create(:retro, key: 'eeeee2', max_votes: 1)
    delta = create(:delta, retro: retro)
    delta_vote = create(:delta_vote, delta: delta, user: '1')
    data = {
      'type' => 'upvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    assert_no_difference('DeltaVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should allow more upvotes than max from a diff user" do
    retro = create(:retro, key: 'eeeee2', max_votes: 1)
    delta = create(:delta, retro: retro)
    delta_vote = create(:delta_vote, delta: delta, user: '1')
    data = {
      'type' => 'upvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '2',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaVote.count', 1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not upvote delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    delta = create(:delta, retro: retro)
    data = {
      'type' => 'upvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    assert_no_difference('DeltaVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should downvote delta" do
    retro = create(:retro, key: 'eeeee2')
    delta = create(:delta, retro: retro)
    delta_vote = create(:delta_vote, delta: delta, user: '1')
    data = {
      'type' => 'downvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    callback.expect :call, nil, [data]
    assert_difference('DeltaVote.count', -1) do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not downvote delta if vote doesnt exist" do
    retro = create(:retro, key: 'eeeee2')
    delta = create(:delta, retro: retro)
    delta_vote = create(:delta_vote, delta: delta, user: '2')
    data = {
      'type' => 'downvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    assert_no_difference('DeltaVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end

  test "should not downvote delta when locked" do
    retro = create(:retro, key: 'eeeee2', status: 'locked')
    delta = create(:delta, retro: retro)
    delta_vote = create(:delta_vote, delta: delta, user: '1')
    data = {
      'type' => 'downvote',
      'itemType' => 'delta',
      'itemId' => delta.id,
      'userId' => '1',
    }
    callback = MiniTest::Mock.new
    assert_no_difference('DeltaVote.count') do
      WebsocketHelper.handle('eeeee2', data, callback)
    end
    callback.verify
  end
end

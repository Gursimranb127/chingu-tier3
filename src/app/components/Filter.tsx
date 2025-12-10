'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { SlidersVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';

export const Filter = () => {
  const { filters, setFilter, clearFilter, clearFilters } = useFilterStore();
  const [filterState, setFilterState] = useState({
    voyageRole: filters.voyageRole || 'all',
    roleType: filters.roleType || 'all',
    soloProjectTier: filters.soloProjectTier || 'all',
    voyage: filters.voyageSignup || 'all',
    voyageTier: filters.voyageTier || 'all',
    gender: filters.gender || 'all',
  });

  useEffect(() => {
    setFilterState({
      voyageRole: filters.voyageRole || 'all',
      roleType: filters.roleType || 'all',
      soloProjectTier: filters.soloProjectTier || 'all',
      voyage: filters.voyageSignup || 'all',
      voyageTier: filters.voyageTier || 'all',
      gender: filters.gender || 'all',
    });
  }, [filters]);

  const handleFilterReset = () => {
    setFilterState({
      voyageRole: 'all',
      roleType: 'all',
      soloProjectTier: 'all',
      voyage: 'all',
      voyageTier: 'all',
      gender: 'all',
    });
    clearFilters();
  };

  const handleFilterSubmit = () => {
    // TODO: create logic for setting and unsetting filters with filter hook
    Object.entries(filterState).forEach(([key, val]) => {
      console.log(key, val);
      if (val === 'all') {
        clearFilter(key);
        return;
      }

      setFilter(`${key}`, val);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SlidersVertical />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="self-start">Filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            <Select
              name="voyageRole"
              value={filterState.voyageRole}
              onValueChange={(value) => {
                setFilterState((prev) => ({
                  ...prev,
                  voyageRole: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="ui/ux designer">UI/UX Designer</SelectItem>
                <SelectItem value="scrum master">Scrum Master</SelectItem>
                <SelectItem value="Product Owner">Product Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="roleType">Role Type</Label>
            <Select
              name="roleType"
              value={filterState.roleType}
              onValueChange={(value) => {
                setFilterState((prev) => ({
                  ...prev,
                  roleType: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="soloProjectTier">Solo Project Tier</Label>
            <ToggleGroup
              type="single"
              value={filterState.soloProjectTier}
              spacing={1}
              className="w-full justify-between"
              onValueChange={(value) => {
                setFilterState((prev) => ({
                  ...prev,
                  soloProjectTier: value,
                }));
              }}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="tier 1">Tier 1</ToggleGroupItem>
              <ToggleGroupItem value="tier-2">Tier 2</ToggleGroupItem>
              <ToggleGroupItem value="tier-3">Tier 3</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="voyage">Voyage</Label>
            <Select
              name="voyage"
              value={filterState.voyage}
              onValueChange={(value) => {
                setFilterState((prev) => ({
                  ...prev,
                  voyage: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="V33">V33</SelectItem>
                <SelectItem value="V34">V34</SelectItem>
                <SelectItem value="V35">V35</SelectItem>
                <SelectItem value="V36">V36</SelectItem>
                <SelectItem value="V37">V37</SelectItem>
                <SelectItem value="V38">V38</SelectItem>
                <SelectItem value="V39">V39</SelectItem>
                <SelectItem value="V40">V40</SelectItem>
                <SelectItem value="V41">V41</SelectItem>
                <SelectItem value="V42">V42</SelectItem>
                <SelectItem value="V43">V43</SelectItem>
                <SelectItem value="V44">V44</SelectItem>
                <SelectItem value="V45">V45</SelectItem>
                <SelectItem value="V46">V46</SelectItem>
                <SelectItem value="V47">V47</SelectItem>
                <SelectItem value="V48">V48</SelectItem>
                <SelectItem value="V49">V49</SelectItem>
                <SelectItem value="V50">V50</SelectItem>
                <SelectItem value="V51">V51</SelectItem>
                <SelectItem value="V52">V52</SelectItem>
                <SelectItem value="V53">V53</SelectItem>
                <SelectItem value="V54">V54</SelectItem>
                <SelectItem value="V55">V55</SelectItem>
                <SelectItem value="V56">V56</SelectItem>
                <SelectItem value="V57">V57</SelectItem>
                <SelectItem value="V58">V58</SelectItem>
                <SelectItem value="V59">V59</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="voyageTier">Voyage Tier</Label>
            <ToggleGroup
              type="single"
              value={filterState.voyageTier}
              spacing={1}
              className="w-full justify-between"
              onValueChange={(value) => {
                setFilterState((prev) => ({
                  ...prev,
                  voyageTier: value,
                }));
              }}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="tier 1">Tier 1</ToggleGroupItem>
              <ToggleGroupItem value="tier 2">Tier 2</ToggleGroupItem>
              <ToggleGroupItem value="tier 3">Tier 3</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="gender">Gender</Label>
            <ToggleGroup
              type="single"
              value={filterState.gender}
              spacing={1}
              className="w-full justify-between"
              onValueChange={(value) => {
                setFilterState((prev) => ({
                  ...prev,
                  gender: value,
                }));
              }}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="male">Male</ToggleGroupItem>
              <ToggleGroupItem value="female">Female</ToggleGroupItem>
              <ToggleGroupItem value="other">Other</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter className="flex flex-row sm:justify-evenly">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleFilterReset}
          >
            Clear Filters
          </Button>
          <DialogClose asChild>
            <Button
              type="submit"
              className="flex-1 rounded-full"
              onClick={handleFilterSubmit}
            >
              Filter Now
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
